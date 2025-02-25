import React, { createContext, useState, useEffect, ReactNode } from "react";
import { load, save, remove } from "../utils/storage/storage";
import { api } from "app/services/api";
import { Level } from "../apiResponseTypes/levelType";
import { useContext } from "react";
import { useRef } from "react";
import { ChildProfile, Preferences, User } from "app/apiResponseTypes";
import { Alert } from "react-native"

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    userData: any,
    expiresIn: number
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setPin: (pin: string) => Promise<void>;
  isPinSet: () => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  isVerified: boolean | null;
  refreshAuthToken: () => Promise<void>;
  syncLevels: (force:boolean) => Promise<void>;
  syncUser: (force:boolean) => Promise<void>;
  updateUserPrefs: (prefs:any) => Promise<void>;
  updateChildren: (children: ChildProfile[]) => Promise<void>;
  removeChildren: (children: ChildProfile[]) => Promise<void>;
  updateGameplayProgress: (levelId: string, questionId: string) => Promise<void>;
  updateSkin: (childId: string, elfieName: string, genderId: string, hairId: string, skinId: string, outfitId: string) => Promise<void>;
  levels: Level[];
  activeChildProfileID: string | null
  setActiveChildProfileID: (id: string | null) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [activeChildProfileID, setActiveChildProfileIDState] = useState<string | null>(null)
  const lastLevelUpdateRef = useRef<number | null>(null);
  const lastUserUpdateRef = useRef<number | null>(null);

  const syncCooldown = 300000;

  const bufferTime = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setLoading(true);
        const storedAccessToken = await load("accessToken");
        const storedRefreshToken = await load("refreshToken");
        const storedIsVerified = await load("isVerified");
        const storedExpiryTime = await load("tokenExpiryTime");

        if (storedAccessToken && storedExpiryTime) {
          setIsLoggedIn(true);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsVerified(storedIsVerified);
          setTokenExpiryTime(Number(storedExpiryTime));
          api.setToken(storedAccessToken);
          const user : User | null = await api.getUser();
          if(user)
          {
            console.log("Set USER - checkUserStatus");
            await setUser(user);
          }
          else
          {
            setIsLoggedIn(false);
            setAccessToken(null);
            setRefreshToken(null);
            console.log("Set USER - checkUserStatus NULL");
            await setUser(null);
            setIsVerified(null);
            setTokenExpiryTime(null);
          }
        } else {
          setIsLoggedIn(false);
          setAccessToken(null);
          setRefreshToken(null);
          console.log("Set USER - checkUserStatus ELSE NULL");
          await setUser(null);
          setIsVerified(null);
          setTokenExpiryTime(null);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  useEffect(() => {
    const updateActiveChildProfile = async () => {
      if (user && !activeChildProfileID) {
        const childProfileId = await load("activeChildProfileID");
        console.log("setActiveChildProfileID useEffect", user);
        await setActiveChildProfileID(childProfileId as string | null);
      }
    };
  
    updateActiveChildProfile();
  }, [user]); 


  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      if (tokenExpiryTime && tokenExpiryTime - currentTime < bufferTime) {
        refreshAuthToken();
      }
      if (tokenExpiryTime && tokenExpiryTime - currentTime <= 0) {
        logout();
        Alert.alert("Your token has expired. Please login again.")
      }
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [tokenExpiryTime]);

  const syncLevels = async (force:boolean = false) => {
    if (!activeChildProfileID) {
      console.warn("Cannot update levels, no active child profile id!");
      return;
    }
  
    const now = Date.now(); // Current timestamp
    if (!force && lastLevelUpdateRef.current && now - lastLevelUpdateRef.current < syncCooldown) {
      console.log("Cooldown active, skipping update.");
      return;
    }
  
    // Set the timestamp for the last update
    lastLevelUpdateRef.current = now;
    console.log("Getting Levels");
  
    try {
      const levelsObj = await api.getLevels(activeChildProfileID);
      setLevels(levelsObj.data.getLevels);
    } catch (error) {
      console.error("Error updating levels:", error);
    }
  };

  const syncUser = async (force:boolean = false) => {
    const now = Date.now();
    if (!force && lastUserUpdateRef.current && now - lastUserUpdateRef.current < syncCooldown) {
      console.log("Cooldown active, skipping update.");
      return;
    }
  
    // Set the timestamp for the last update
    lastUserUpdateRef.current = now;
  
    try {
      const user = await api.getUser();
      if(!user)
      {
        throw new Error("Failed to get User");
      }
      console.log("Set USER - syncUser");
      await setUser(user);
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const updateUserPrefs = async (prefs:Preferences) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...prefs,
        },
      }
      await setUser(updatedUser);
    }
    
  };
  
  const removeChildren = async (childrenProfiles: ChildProfile[]): Promise<void> => {
    if (user) {
  
      // Ensure both arrays are valid and log IDs for clarity
      const childrenToRemoveIds = childrenProfiles.map((child) => child.id);
      console.log("IDs to remove:", childrenToRemoveIds);
  
      // Remove children whose IDs match the provided profiles
      const updatedChildren = user.children.data.filter(
        (existingChild) => !childrenToRemoveIds.includes(existingChild.id)
      );
  
      console.log("REMOVE updatedChildren", updatedChildren);
  
      // Create the updated user object
      const updatedUser: User = {
        ...user,
        children: {
          ...user.children,
          data: updatedChildren,
        },
      };
  
      console.log("Set USER - removeChildren", updatedUser.children.data);
  
      // Update the user state
      await setUser(updatedUser);
      
    } else {
      console.warn("User not found. Cannot remove children.");
    }
  };
  
  
  const updateChildren = async (childrenProfiles: ChildProfile[]) => {
    if (user) {
  
      // Update or add children
      const updatedChildren = [
        ...user.children.data.filter(
          (existingChild) =>
            !childrenProfiles.some((newChild) => newChild.id === existingChild.id)
        ),
        ...childrenProfiles, // Place updated children first

      ];
  
      // Create updated user object
      const updatedUser: User = {
        ...user,
        children: {
          ...user.children,
          data: updatedChildren,
        },
      };
      console.log("Set USER - updateChildren");
      // Update user state
      await setUser(updatedUser);
    }
    else
      console.warn("User not found. Cannot update children.");

  };
  

  const updateSkin = async (
    childId: string,
    elfieName: string,
    genderId: string,
    hairId: string,
    skinId: string,
    outfitId: string
  ) => {
    if (!user) {
      console.warn("User not found. Cannot update skin.");
      return;
    }

    console.log("Skin COLOR selected", skinId);
  
    // Find the child and update the skin attributes
    const updatedChildren = user.children.data.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          character: {
            ...child.character,
            name: elfieName,
            skin: {
              color: skinId,
              gender: genderId,
              hair_style: hairId,
              outfit: outfitId,
            },
          },
        };
      }
  
      // Return the child unchanged
      return child;
    });

    // Call updateChildren to update the user state
    updateChildren(updatedChildren);
  };  

  const updateGameplayProgress = async (levelId: string, questionId: string) => {
    if (!levels) {
      console.log("Cannot update progress as levels is null");
      return;
    }
  
    const currentLevel = levels.find((level) => level.id === levelId);
  
    if (!currentLevel) {
      console.warn(`Cannot update progress: level with ID ${levelId} not found.`);
      return;
    }
  
    if (!currentLevel.questions.some((q) => q.id === questionId)) {
      console.warn(
        `Cannot update progress: question with ID ${questionId} not found in level ${levelId}.`
      ); 
      return;
    }
  

    // Add the questionId to the completedQuestions if it doesn't already exist
    if (!currentLevel.completedQuestions.find((cq)=>cq.id === questionId)) {
      const updatedLevels = levels.map((level) => {
        if (level.id === levelId) {
          console.log("Updating progress",questionId, level.completedQuestions );
          return {
            ...level,
            completedQuestions: [
              ...level.completedQuestions,
              {id: questionId},
            ], 
          };
        }
        return level;
      });
  
      setLevels(updatedLevels); // Update the state with the new levels
      console.log("Gameplay progress updated:", updatedLevels.find((level) => level.id === levelId)?.completedQuestions);
    } else {
      console.log(`Question ID ${questionId} is already completed for level ${levelId}.`);
    }
  };
  
  

  const getFirstChildId = () =>
  {
    if (user) 
    {
      //Set default Child id
      if (user.children.data.length > 0) {
        const firstChildId = user.children.data[0]?.id
        if (firstChildId) {
          return firstChildId;
        }
      }
    }
    else
      console.log("Cant get getFirstChildId as user is null");
    return null;
  }

  const setActiveChildProfileID = async (id: string | null) => {
    if(id === null)
    {
      id = getFirstChildId();
      if(id === null)
      {
        console.log("unable to get first child")
        return;
      }
    }
    console.log("USer before set ID", user)
    const childProfile = user?.children?.data?.find((child)=>{ return child.id === id});

    if(!childProfile)
    {
      console.warn("Could not set active ID because it could not be found!");
      return;
    }

    console.log("setActiveChildProfileID", id)
    await save("activeChildProfileID", id)
    setActiveChildProfileIDState(id)
    lastLevelUpdateRef.current = null;
    const levelsObj = await api.getLevels(id)
    setLevels(levelsObj.data.getLevels)

  }

  const login = async (
    accessToken: string,
    refreshToken: string,
    userData: User,
    expiresIn: number = 3600
  ) => {
    try {
      const expiryTime = Date.now() + expiresIn * 1000;

      await save("accessToken", accessToken);
      await save("refreshToken", refreshToken);
      await save("isVerified", true);
      await save("tokenExpiryTime", expiryTime.toString());

      const activeChildProfileId = await load("activeChildProfileID") as string | null;
      console.log("setActiveChildProfileID login")
      setActiveChildProfileID(activeChildProfileId);
      
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      console.log("SET USER - Login");
      await setUser(userData);
      setIsLoggedIn(true);

      api.setToken(accessToken);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      await remove("accessToken");
      await remove("refreshToken");
      await remove("user");
      await remove("isVerified");
      await remove("tokenExpiryTime");
      await remove("userPin");
      await remove("activeChildProfileID");

      setIsLoggedIn(false);
      setAccessToken(null);
      setRefreshToken(null);
      console.log("SET USER - LOGOUT");
      await setUser(null);
      setIsVerified(null);
      setTokenExpiryTime(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const refreshAuthToken = async () => {
    if (refreshToken) {
      try {
        const data = await api.refreshToken(refreshToken);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = data;

        const newExpiryTime = Date.now() + expiresIn * 1000;
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setTokenExpiryTime(newExpiryTime);
        api.setToken(newAccessToken);

        await save("accessToken", newAccessToken);
        await save("refreshToken", newRefreshToken);
        await save("tokenExpiryTime", newExpiryTime.toString());
      } catch (error) {
        console.error("Token refresh failed:", error);
        await logout();
      }
    }
  };

  const setPin = async (pin: string) => {
    try {
      await save("userPin", pin);
      console.log("PIN set successfully");
    } catch (error) {
      console.error("Error setting PIN:", error);
    }
  };

  const isPinSet = async (): Promise<boolean> => {
    try {
      const pin = await load("userPin");
      return pin !== null;
    } catch (error) {
      console.error("Error checking if PIN is set:", error);
      return false;
    }
  };

  const verifyPin = async (enteredPin: string): Promise<boolean> => {
    try {
      const storedPin = await load("userPin");
      return storedPin === enteredPin;
    } catch (error) {
      console.error("Error verifying PIN:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        loading,
        setPin,
        isPinSet,
        verifyPin,
        isVerified,
        refreshAuthToken,
        syncLevels,
        syncUser,
        updateUserPrefs,
        removeChildren,
        updateChildren,
        updateSkin,
        updateGameplayProgress,
        levels,
        activeChildProfileID,
        setActiveChildProfileID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
