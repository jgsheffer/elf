import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import { GradientContainer } from "./GradientContainer";
import { GradientButton } from "./GradientButton";
import { Level } from "app/apiResponseTypes";

const { width, height } = Dimensions.get('window');

interface LocationUnlockedPanelProps 
{
  onNextClicked: () => void; 
  level: Level
}

export const LocationUnlockedPanel: React.FC<LocationUnlockedPanelProps> = ({ onNextClicked, level }) => {

  const flagAsset = () => {
    const asset = level?.country?.assets?.find((asset) => asset.role?.toLowerCase() === "flag");
    return asset?.url;
  }

  return (
    <GradientContainer 
    topOuterChildren = {
      <View style={styles.outerChildrenContainer}>
        <GradientButton 
          isValid = {false}
          invalidOuterGradientColors = {["#A4D1E7", "#FDFFFF"]}
          invalidInnerGradientColors = {["#FFFFFF", "#D2EBF5"]}
          text={"New Location\n Unlocked!"}
          imageSource={require("../../assets/icons/unlock_icon.png")}
          innerViewStyle={[styles.innerLocationUnlocked]} 
          outerViewStyle={[styles.outerLocationUnlocked]} 
          imageStyle={[styles.unlockImage]}
          textStyle={[styles.unlockedButtonText]}
        />
        <Text style={styles.locationText}>{level.name.en + ", " + level.country.name.en}</Text>
      </View>
    }
    bgGradientColors={["#021249CC", "#116ABFCC", "#0065DBCC", "#229DFFCC"]}
  >
    <Image
      style={[styles.image, { width: width * .7, height: height * 0.25 }]}
      source={{ uri: flagAsset() }}
    />
    <GradientButton text={"Next"} onPress={onNextClicked}/>
  </GradientContainer>
  );
};

const styles = StyleSheet.create({
  outerChildrenContainer: {
    width: "90%",
    top: "-10%"
  },
  locationText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    width: "100%"
  },
  innerLocationUnlocked: {
    width: "100%",
    flexDirection: "row",
  },
  outerLocationUnlocked: {
    width: "100%",
  },
  flagButton: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    width: "100%"
  },
  image: {
    resizeMode:"contain"
  },
  unlockImage: {
    resizeMode:"contain",
    width: "15%",
    height: "100%",
    marginLeft: "0%"
  },
  unlockedButtonText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
    width: "70%"
  },
});