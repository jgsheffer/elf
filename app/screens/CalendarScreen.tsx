import { useState, useContext, useCallback } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Platform, StyleSheet, Image, Dimensions } from 'react-native';
import { GradientButton } from "../components/GradientButton";
import { ButtonsHeader } from "../components/ButtonsHeader";
import { Elfie } from 'app/components/Elfie';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext"
import { useFocusEffect } from '@react-navigation/native';
import React from "react";

export const CalendarScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [ imageDimensions, setImageDimensions ] = useState({ width: 0, height: 0 });

  const { levels = [], syncLevels } = useAuth();
  const currentDate = new Date();
  console.log("currentDate", currentDate)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth()+1 > 12 ? 1 : currentDate.getMonth()+1)
  console.log("selectedMonth", selectedMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log("Called Update levels");
  
        if (syncLevels) {
          try {
            await syncLevels(false);  
            console.log("UpdateLevels completed successfully");
          } catch (error) {
            console.error("Error in updateLevels:", error);
          }
        } else {
          console.log("UpdateLevels function is null");
        }
      };
  
      fetchData(); 
  
      return () => {
         
      };
    }, []) 
  );

  const months = [
    { label: "January", value: 1, abbreviation: "Jan" },
    { label: "February", value: 2, abbreviation: "Feb" },
    { label: "March", value: 3, abbreviation: "Mar" },
    { label: "April", value: 4, abbreviation: "Apr" },
    { label: "May", value: 5, abbreviation: "May" },
    { label: "June", value: 6, abbreviation: "Jun" },
    { label: "July", value: 7, abbreviation: "Jul" },
    { label: "August", value: 8, abbreviation: "Aug" },
    { label: "September", value: 9, abbreviation: "Sep" },
    { label: "October", value: 10, abbreviation: "Oct" },
    { label: "November", value: 11, abbreviation: "Nov" },
    { label: "December", value: 12, abbreviation: "Dec" },
  ];
  
  const days = () => {
    let num = 31;
    if(selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11)
    {
      num = 30
    }
    else if(selectedMonth === 2)
    {
      num = (selectedYear && selectedYear % 4 == 0) ? 29 : 28 
    }
    return num;
  }

  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  const changeMonth = (forward:boolean) => {
    let nextMonth = selectedMonth ? (forward ? selectedMonth+1: selectedMonth-1) : 1;
    if(nextMonth > 12)
    {
      setSelectedYear(selectedYear+1);
      nextMonth = 1;
    }
    if(nextMonth <= 0)
    {
      setSelectedYear(selectedYear-1);
      nextMonth = 12;
    }

    setSelectedMonth(nextMonth)
  };

  const convertUTCToLocalTime = (time: string): Date => {
    // Parse the UTC time string into a Date object
    const utcDate = new Date(time);
  
    // Check if the parsed date is valid
    if (isNaN(utcDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    // Convert the UTC date to local time
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60 * 1000);
  
    return localDate;
  };

  const cards = Array.from({ length: days() }, (_, i) => ({
    id: i,
    label: `${i + 1}`,
    widthPercentage: 15,
    heightPercentage: 6,
  }));

  const getDateFromParts = (year:number, month:number, day:number) => {
    return new Date(year, month, day);
  };

  const compareDates = (date1: Date, date2: Date): "equal" | "greater" | "less" => {
    // Normalize dates by setting the time to 00:00:00.000
    const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    //console.log("normalizedDate1", normalizedDate1, "normalizedDate2", normalizedDate2);
    // Compare normalized timestamps
    if (normalizedDate1.getTime() === normalizedDate2.getTime()) {
      return "equal"; // Dates are the same (year, month, day)
    } else if (normalizedDate1.getTime() > normalizedDate2.getTime()) {
      return "greater"; // date1 is after date2
    } else {
      return "less"; // date1 is before date2
    }
  };

  const getCardLevel = (index:number) => {
    const cardDate = getDateFromParts(selectedYear, selectedMonth-1, index + 1);
    const level = levels?.find((level)=> level.isAvailable && compareDates(convertUTCToLocalTime(level.scheduledAt), cardDate) === "equal");
    return level;
  };

  const isCompleted = (index:number) => {
    const level = getCardLevel(index);
    return level ? level.completedQuestions.length === level.questions.length : false;
  };

  const isDisabled = (index:number) => {
    const level = getCardLevel(index);
    if(level && !isGreyedOut(index))
      return false;

    return true;
  };

  const isGreyedOut = (index:number) => {
    const level = getCardLevel(index);
    if(level)
    {
      const isIncomplete = level.completedQuestions.length !== level.questions.length;
      const today = new Date();
      return isIncomplete && compareDates(today, convertUTCToLocalTime(level.scheduledAt)) !== "equal";
    }
    return false;
  };

  const onPress = (index:number) => {
    if(isDisabled(index))
    {
      return;
    }

    const level = getCardLevel(index);
    if(level && isCompleted(index))
    {
      if(Platform.OS === "ios")
      {
        navigation.navigate("Globe", { level })
      }
      else
      {
        navigation.navigate("GlobeAndroid", { level })
      }
    }
    else if(level)
      navigation.navigate("Gameplay", { level })
  };

  const getSourceImage = (index:number) => {
    if(isCompleted(index))
      return {uri: flagAsset(index)}
    else
      return require("../../assets/images/calendar_day_back.png")
  };

  const getStyle = (index:number) => {
    if(isCompleted(index))
      return "stretch";
    else
      return undefined;
  };

  const getCompletedLevelsThisMonth = () => {
    let count = 0;
    levels?.map((level)=>{
      console.log("selectedMonth", selectedMonth, "scheduledAtMonth", convertUTCToLocalTime(level.scheduledAt).getMonth());
      const isCompleted = level.completedQuestions.length === level.questions.length;
      if(isCompleted && new Date(level.scheduledAt).getMonth()+1 === selectedMonth)
        count = count +1;
    });
    return count;
  };

  const flagAsset = (index:number) => {
    const asset = getCardLevel(index)?.country?.assets?.find((asset) => asset.role?.toLowerCase() === "flag");
    return asset?.url;
  }


  return (
    <ImageBackground
      source={require("../../assets/images/calendar_background.png")}
      style={styles.bgGradient}
    >
      <ButtonsHeader
      imageSourceLeftButton = {require("../../assets/icons/profile_icon.png")}
      imageSourceRightButton = {require("../../assets/icons/settings_icon.png")}
      onPressLeft = {()=> {navigation.navigate("Profile")}}
      onPressRight = {() => navigation.navigate("Settings")}
      />

      <View style={styles.outerContainer}>
        <Elfie zIndex={0} style={[styles.elfie]} animationIndex={0} />
        <View style={styles.innerContainer}>

          <TouchableOpacity style={styles.arrowContainer}
            onPress={()=>changeMonth(false)}
          >
            <Image source={require("../../assets/images/icon-back.png")} style={styles.leftArrow} />
          </TouchableOpacity>
          
          <ImageBackground
            source={require("../../assets/images/calendar_shape.png")} 
            style={[{width: screenWidth * 0.8, height: screenHeight * 0.7, }, styles.calendar]}
            resizeMode="contain"
            onLayout={handleImageLayout}
          >
            <GradientButton
              isValid={false}
              outerViewStyle={[{ width: "55%", top: "2%" }]}
              innerViewStyle={[{ width: "100%", paddingVertical: 5, marginVertical: 0 }]}
              invalidInnerGradientColors={["#FA0017", "#FA0017"]}
            >
              <Text style={styles.monthText}>{ ( selectedMonth-1 > 11 || selectedMonth-1 < 0) ? "Month":months[selectedMonth-1].label }</Text>
            </GradientButton>

            {imageDimensions.width > 0 && (
              <View
                style={{
                  width: imageDimensions.width * 0.95,
                  height: imageDimensions.height * 0.6,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  left: "1.5%",
                  top: "10%",
                }}
              >
                {cards.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[{
                      width: (imageDimensions.width * item.widthPercentage) / 100,
                      height: (imageDimensions.height * item.heightPercentage) / 100,
                      backgroundColor: '#62AC61',
                      borderWidth: 1,
                      borderColor: 'white',
                      margin: 5,
                    }]}
                    disabled={isDisabled(item.id)}
                    onPress={()=>onPress(item.id)}
                  >
                    <Image source={getSourceImage(item.id)} 
                      style={[styles.icon]}
                      resizeMode={getStyle(item.id)}  />
                    <Text style={styles.dayLabel}>{item.label}</Text>
                    {isDisabled(item.id) && (
                      <>
                        {!isGreyedOut(item.id) && (<Image
                          source={require("../../assets/icons/lock_icon.png")}
                          style={[
                            styles.icon,
                            { tintColor: "#000000" }, // Conditional tint color
                            { position: "absolute" } // Ensure it's absolutely positioned
                          ]}
                        />)}

                        {isGreyedOut(item.id) && (
                          <View
                            style={{
                              ...StyleSheet.absoluteFillObject, // Covers the entire parent
                              backgroundColor: "rgba(115, 115, 115, 0.5)", // Transparent grey overlay
                            }}
                          />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <GradientButton
              isValid={false}
              invalidInnerGradientColors={["#FFFFFF", "#FFFFFF"]}
              outerViewStyle={[{ width: "50%" }]}
            >
              <Text style={styles.scorecardButtonText}>SCORECARD</Text>
              <Text style={styles.progressText}>{getCompletedLevelsThisMonth()}/{cards.length} CORRECT!</Text>
            </GradientButton>
          </ImageBackground>
            <TouchableOpacity style={styles.arrowContainer}            
              onPress={()=>changeMonth(true)}
            >
              <Image source={require("../../assets/images/icon-back.png")} style={styles.rightArrow} />
            </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgGradient: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  outerContainer: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: "50%"
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    top: "-50%",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
  },
  elfie: {
    top: "-55%",
    width:"60%",
    height:"60%",
    position: 'absolute',
    zIndex:0
  },
  calendar:{
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2 
  },
  monthText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dayLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    borderColor: "#000000",
    position:"absolute",
    left:"0%",
    bottom:"0%",
    textShadowColor: 'black',
    textShadowRadius: 4,
    fontWeight: "bold", // Font weight
    textShadowOffset: { width: -1, height: 1 }, // Horizontal and vertical offsets
  },
  progressText: {
    fontSize: 12,
    color: '#007bff',
    marginBottom: 5,
  },
  scorecardButtonText: {
    color: '#000000',
    fontSize: 12,
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  rightArrow: {
    width: "100%",
    resizeMode: "contain",
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleX: -1 }],
    right: "-20%"
  },
  leftArrow: {
    width: "100%",
    resizeMode: "contain",
    alignItems: 'center',
    justifyContent: 'center',
    left: "-20%"
  },
  arrowContainer: {
    width: "6%",
    alignItems: 'center',
    justifyContent: 'center',
    top:"-4%"
  },
});
