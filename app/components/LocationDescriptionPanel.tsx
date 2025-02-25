import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import { GradientContainer } from "./GradientContainer";
import { GradientButton } from "./GradientButton";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext"
import { Level } from "app/apiResponseTypes";
import { save, load } from "../utils/storage/storage"

const { width, height } = Dimensions.get('window');

interface LocationDescriptionPanelProps 
{
    level: Level
}

export const LocationDescriptionPanel: React.FC<LocationDescriptionPanelProps> = ({level}) => {

  const navigation = useNavigation();
  const [isDemoComplete, setIsDemoComplete] = useState<boolean>(false);
  const { user, isLoggedIn, levels = [] } = useContext(AuthContext) || {};

  useFocusEffect(
    useCallback(() => {
      const fetchLastLevelCompleted = async () => {
        try {
          let count = 0;
          levels.map((level)=>{
            const isCompleted = level.completedQuestions.length === level.questions.length;
            if(isCompleted)
              count = count +1;
          });

          if(level !== null)
            setIsDemoComplete(count === levels.length);
        } catch (error) {
          console.error("Error loading last level completed:", error);
        }
      };
  
      fetchLastLevelCompleted();
  

      return () => {

      };
    }, [])
  );

  const landmarkAsset = () => {
    const asset = level?.assets?.find((asset) => asset.role?.toLowerCase() === "landmark");
    return asset?.url;
  }

  return (
    <GradientContainer 
      topOuterChildren = {
        <View style={styles.topOuterChildrenContainer}>
          <Text style={styles.locationText}>{level.name.en + ", " + level.country.name.en }</Text>
        </View>
      }
      bottomOuterChildren = {
        <View style={styles.bottomOuterChildrenContainer}>
          <GradientButton
            text={`Skip`}
            isValid={true}
            textStyle={[styles.skipText]}
            outerViewStyle={[styles.skipButton]}
            validInnerGradientColors={["#00386C", "#0761B5"]}
            validOuterGradientColors={["#228DEF", "#023F78"]}
            onPress={()=>{ isLoggedIn ? (isDemoComplete ? navigation.navigate("ComingSoon") : navigation.navigate("Calendar")) : navigation.navigate("Welcome") }}
          />
        </View>
      }
      bgGradientColors={["#021249CC", "#116ABFCC", "#0065DBCC", "#229DFFCC"]}
    >
    <Image
      style={[styles.image, { width: width * 0.7, height: height * 0.25 }]}
      source={{ uri: landmarkAsset() }}
    />
    <Text style={styles.locationDescriptionText}>
      {level.recapDescription.en}
    </Text>
    <GradientButton
      innerViewStyle={[styles.innerViewStyle]} 
      text={"Next"} 
      onPress={()=>{ isLoggedIn ? (isDemoComplete ? navigation.navigate("ComingSoon") : navigation.navigate("Calendar")) : navigation.navigate("Welcome") }}
    />
  </GradientContainer>
  );
};

const styles = StyleSheet.create({
  topOuterChildrenContainer: {
    alignItems: 'center',
    justifyContent: "center",
    top:"-5%"
  },
  bottomOuterChildrenContainer: {
    top:"5%",
    right:"-20%",
    width: "40%",
  },
  locationDescriptionText: {
    marginTop: "4%",
    fontSize: 17,
    textAlign: "center",
    color: "#000000",
    width: "100%"
  },
  locationText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    width: "100%"
  },
  innerViewStyle: {
    width: "100%",
    paddingVertical: "4%",
  },
  image: {
    resizeMode:"contain"
  },
  skipText: {
    fontFamily: "BowlbyOneSC-Regular",
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  skipButton: {
    zIndex: 10,
  },
});