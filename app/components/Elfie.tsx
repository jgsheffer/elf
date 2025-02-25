import { View, StyleSheet, Image, ImageStyle, Text, Platform } from 'react-native';
import { skinColorIconData, hairIconData, genderIconData, outfitIconData } from '../data/ElfieCustomizationData';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { animationJsons } from "../animations/AnimationData"
import { useAuth } from "../contexts/AuthContext"

interface ElfieProps {
  colorIndex?: number;
  hairIndex?: number;
  outfitIndex?: number;
  genderIndex?: number;
  zIndex: number;
  style?: ImageStyle[] | null;
  elfieStyle?: ImageStyle[] | null;
  maskStyle?: ImageStyle[] | null;
  textBoxMessage?: string | null;
  showMask?: boolean;
  animationIndex?: number;
  loopAnimation?: boolean;
}

export const Elfie: React.FC<ElfieProps> = ({
  colorIndex: propColorIndex,
  hairIndex: propHairIndex,
  outfitIndex: propOutfitIndex,
  genderIndex: propGenderIndex,
  zIndex = 0,
  style = null,
  maskStyle = null,
  elfieStyle = null,
  textBoxMessage = null,
  animationIndex: propAnimationIndex,
  loopAnimation = false,
}) => {

  const [colorIndex, setColorIndex] = useState(propColorIndex || 0);
  const [hairIndex, setHairIndex] = useState(propHairIndex || 0);
  const [outfitIndex, setOutfitIndex] = useState(propOutfitIndex || 0);
  const [genderIndex, setGenderIndex] = useState(propGenderIndex || 0);
  const [animationIndex, setAnimationIndex] = useState(propAnimationIndex || 0);
  const { user, activeChildProfileID } = useAuth();

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [loadedLayers, setLoadedLayers] = useState(0); // Track loaded layers
  const totalLayers = 4; // Adjust this based on the number of layers (baseBody, hair, gender, outfit)


  // Count loaded layers and set loading state
  const handleLayerLoaded = () => {
    
    if(Platform.OS === "android")
      setLoadedLayers((prev) => prev + 1);
  };

  useEffect(() => {
    if (Platform.OS === "android" && loadedLayers >= totalLayers) {
      setIsLoading(false);
    }
  }, [loadedLayers]);
  
  const outfitAnim  = (indexOverride:number | null = null)=>{
    switch(outfitIndex)
    {
      case 0:
        return getAnimationJsons(indexOverride)?.layers.outfit1
      case 1:
        return getAnimationJsons(indexOverride)?.layers.outfit2
      case 2:
        return getAnimationJsons(indexOverride)?.layers.outfit3
      default:
        return getAnimationJsons(indexOverride)?.layers.outfit1
    }
 }

  const genderAnim = (indexOverride:number | null = null)=>{
    switch(genderIndex)
    {
      case 0:
        return getAnimationJsons(indexOverride)?.layers.gender1
      case 1:
        return getAnimationJsons(indexOverride)?.layers.gender2
      case 2:
        return getAnimationJsons(indexOverride)?.layers.gender3
      default:
        return getAnimationJsons(indexOverride)?.layers.gender1
    }
  }

  const hairAnim = (indexOverride:number | null = null)=>{
    switch(Math.trunc(hairIndex/3))
    {
      case 0:
        return getAnimationJsons(indexOverride)?.layers.hair1
      case 1:
        return getAnimationJsons(indexOverride)?.layers.hair2
      case 2:
        return getAnimationJsons(indexOverride)?.layers.hair6
      case 3:
        return getAnimationJsons(indexOverride)?.layers.hair4
      case 4:
        return getAnimationJsons(indexOverride)?.layers.hair5
      case 5:
        return getAnimationJsons(indexOverride)?.layers.hair3
      default:
        return getAnimationJsons(indexOverride)?.layers.hair1
    }
  }

  const loadHair = async () => {
    const child = user?.children?.data.find((child)=>child.id === activeChildProfileID );
    const elfieHairId = child?.character?.skin?.hair_style;
    if (elfieHairId !== undefined) 
    {
      const elfieHairIndex = hairIconData.findIndex((item) => item.uuid === elfieHairId);
      setHairIndex(elfieHairIndex as number);
    }
  };

  const loadOutfit = async () => {
    const child = user?.children?.data.find((child)=>child.id === activeChildProfileID );

    const elfieOutfitId = child?.character?.skin?.outfit;
    if (elfieOutfitId !== undefined) 
    {
      const elfieOutfitIndex = outfitIconData.findIndex((item) => item.uuid === elfieOutfitId);
      setOutfitIndex(elfieOutfitIndex as number);
    }
  };

  const loadColor = async () => {
    const child = user?.children?.data.find((child)=>child.id === activeChildProfileID );
    const elfieSkinId = child?.character?.skin?.color;
    if (elfieSkinId !== undefined) 
    {
      const elfieSkinIndex = skinColorIconData.findIndex((item) => item.uuid === elfieSkinId);
      setColorIndex(elfieSkinIndex as number);
    }
  };

  const loadGender = async () => {
    const child = user?.children?.data.find((child)=>child.id === activeChildProfileID );
    const elfieGenderId = child?.character?.skin?.gender;
    if (elfieGenderId !== undefined) 
    {
      const elfieGenderIndex = genderIconData.findIndex((item) => item.uuid === elfieGenderId);
      setGenderIndex(elfieGenderIndex as number);
    }
  };

  const getActiveColor = (buttonData: Array<{ id: number, color?: string }>, lastSelectedId: number | null) => {
    const c = buttonData.find(button => button.id === lastSelectedId)?.color || "#F7D0B1";
    return c;
  }

  useEffect(() => {
    if (propColorIndex !== undefined) 
    {
      setColorIndex(propColorIndex);
    }
    else
    {
      loadColor();
    }

  }, [propColorIndex]);

  useEffect(() => {
    if (propHairIndex !== undefined)
    {
      setHairIndex(propHairIndex);
    }
    else
    {
      loadHair();
    }
  }, [propHairIndex]);

  useEffect(() => {
    if (propOutfitIndex !== undefined)
    {
      setOutfitIndex(propOutfitIndex);
    }
    else
    {
      loadOutfit();
    }
  }, [propOutfitIndex]);

  useEffect(() => {
    if (propGenderIndex !== undefined)
    {
      setGenderIndex(propGenderIndex);
    }
    else
    {
      loadGender();
    }
  }, [propGenderIndex]);

  useEffect(() => {
    console.log("Setting new animation", propAnimationIndex);

    if(Platform.OS === "android")
    {
      setIsLoading(true);
      setLoadedLayers(0);
    }

    if (propAnimationIndex !== undefined) {
      setAnimationIndex(propAnimationIndex);
    }
  }, [propAnimationIndex]);

  const getAnimationJsons = (indexOverride:number | null = null) =>
  {
    if(animationIndex < animationJsons.length)
      return animationJsons[animationIndex]

    console.error("Animation not found")
    return null;
  }

  const renderElfieContent = () => {
    return (
      <>
        { Platform.OS === "android" && (animationIndex === 0 || isLoading) && getAnimationJsons(0)?.layers.baseBody?.variations.map((vari, index) => {
          const activeColor = getActiveColor(skinColorIconData, colorIndex);

          if (activeColor === vari.id) {

            return vari?.jsons?.map((json, subIndex) => {
              return (
                <LottieView
                  key={`${json.id}-${subIndex}`}
                  source={json.json}
                  autoPlay={false}
                  loop={false}
                  speed={1}
                  style={[styles.elfie, elfieStyle, { zIndex: json.zIndex + zIndex }]}
                  cacheComposition
                  onAnimationLoaded={handleLayerLoaded}
                  onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                  renderMode="AUTOMATIC"
                />
              );
            });
          }

          return null; 
        })}

        {Platform.OS === "android" && (animationIndex === 0 || isLoading) && hairAnim(0)?.jsons.map((vari, index) => {
          return (
            Math.trunc(hairIndex%3)+1 === vari.colorIndex && (
              <LottieView
                key={`${vari.id}-${index}`}
                source={vari?.json}
                autoPlay={false}
                loop={false}
                speed={1}
                style={[styles.elfie, elfieStyle, { zIndex: vari.zIndex + zIndex }]}
                cacheComposition
                onAnimationLoaded={handleLayerLoaded}
                onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                renderMode="AUTOMATIC"
                
              />
            )
          );
        })}

  
        {Platform.OS === "android" && (animationIndex === 0 || isLoading) && genderAnim(0)?.jsons.map((json, index) => {
          return (
            (!json.colorIndex || Math.trunc(hairIndex % 3)+1 === json.colorIndex) && (
              <LottieView
                key={`${json.id}-${index}`}
                source={json.json}
                autoPlay={false}
                loop={false}
                speed={1}
                style={[styles.elfie, elfieStyle, { zIndex: json.zIndex + zIndex }]}
                cacheComposition
                onAnimationLoaded={handleLayerLoaded}
                onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                renderMode="AUTOMATIC"
              />
            )
          );
        })}
  
        {Platform.OS === "android" &&  (animationIndex === 0 || isLoading) && outfitAnim(0)?.jsons.map((json, index) =>(
            <LottieView
              key={`${json.id}-${index}`}
              source={json.json}
              autoPlay={false}
              loop={false}
              speed={1}
              style={[
                styles.elfie,
                elfieStyle,
                { zIndex: json.zIndex + zIndex },
              ]}
              cacheComposition
              onAnimationLoaded={handleLayerLoaded}
              onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
              renderMode="AUTOMATIC"
            />
          ))
        }


        {getAnimationJsons()?.layers.baseBody?.variations.map((vari, index) => {
          const activeColor = getActiveColor(skinColorIconData, colorIndex);

          if (activeColor === vari.id) {

            return vari?.jsons?.map((json, subIndex) => {
              return (
                <LottieView
                  key={`${json.id}-${subIndex}`}
                  source={json.json}
                  autoPlay={(!isLoading || Platform.OS === "ios")}
                  loop={loopAnimation}
                  speed={.99}
                  style={[styles.elfie, elfieStyle, { zIndex: json.zIndex + zIndex }]}
                  cacheComposition
                  onAnimationLoaded={handleLayerLoaded}
                  onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                  renderMode="AUTOMATIC"
                />
              );
            });
          }

          return null; 
        })}

        {hairAnim()?.jsons.map((vari, index) => {
          return (
            Math.trunc(hairIndex%3)+1 === vari.colorIndex && (
              <LottieView
                key={`${vari.id}-${index}`}
                source={vari?.json}
                autoPlay={(!isLoading || Platform.OS === "ios")}
                loop={loopAnimation}
                speed={.99}
                style={[styles.elfie, elfieStyle, { zIndex: vari.zIndex + zIndex }]}
                cacheComposition
                onAnimationLoaded={handleLayerLoaded}
                onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                renderMode="AUTOMATIC"
                
              />
            )
          );
        })}

  
        {genderAnim()?.jsons.map((json, index) => {
          return (
            (!json.colorIndex || Math.trunc(hairIndex % 3)+1 === json.colorIndex) && (
              <LottieView
                key={`${json.id}-${index}`}
                source={json.json}
                autoPlay={(!isLoading || Platform.OS === "ios")}
                loop={loopAnimation}
                speed={.99}
                style={[styles.elfie, elfieStyle, { zIndex: json.zIndex + zIndex }]}
                cacheComposition
                onAnimationLoaded={handleLayerLoaded}
                onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
                renderMode="AUTOMATIC"
              />
            )
          );
        })}
  
        { outfitAnim()?.jsons.map((json, index) =>(
            <LottieView
              key={`${json.id}-${index}`}
              source={json.json}
              autoPlay={(!isLoading || Platform.OS === "ios")}
              loop={loopAnimation}
              speed={.99}
              style={[
                styles.elfie,
                elfieStyle,
                { zIndex: json.zIndex + zIndex },
              ]}
              cacheComposition
              onAnimationLoaded={handleLayerLoaded}
              onAnimationFailure={(error)=>{console.error("ANIMATION FAILED", error)}}
              renderMode="AUTOMATIC"
            />
          ))
        }
      </>
    );
    
  }



  return (
    <View pointerEvents="none" style={[styles.elfieContainer, style]}>
      {textBoxMessage && (
        <View style={styles.dialogContainer}>
          <Image
            style={[styles.textBoxImage]}
            source={require("../../assets/images/text_box_small.png")}
          />
          <Text adjustsFontSizeToFit style={styles.dialogText}>{textBoxMessage}</Text>
        </View>
      )}
      {maskStyle ? (
        <View style={[styles.maskContainer, maskStyle]}>
          {renderElfieContent()}
        </View>
      ) : (
        renderElfieContent()
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  elfieContainer: {
    aspectRatio: 1,
    height: "100%",
    width: "100%",
    zIndex: 1,
    position: "relative", 
  },
  dialogContainer: {
    height: "100%",
    width: "100%",
    zIndex: 1, 
    alignItems: 'center',
    position: "absolute",
    top:"-58%",
    right:"-35%"
  },
  loadingContainer: {
    aspectRatio: 1,
    height: "100%",
    width: "100%",
    left:"40%",
    top:"-60%",
    zIndex: 1,
    position: "relative", 
  },
  textBoxImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
    aspectRatio: 1,
    resizeMode: 'contain',
    top: "0%",
  },
  dialogText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold', 
    position: "absolute",
    top: "42%"
  },
  maskContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  elfie: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute", 
  },
});
