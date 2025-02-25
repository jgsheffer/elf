import { GradientContainer } from "app/components/GradientContainer";
import { Text, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react"
import { GradientButton } from "../components/GradientButton"
import { AuthContext } from "../contexts/AuthContext"
import Video from "react-native-video";

export const ComingSoonScreen = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <GradientContainer>
      <Text style={styles.text}>Coming Soon!</Text>
      <Video
          source={require("../../assets/videos/coming_soon_720.mov")}
          style={[{width:"100%", height:"50%", top:"5%" }]}
          resizeMode="stretch"
          playInBackground={false}
          paused={false}
        />
      <GradientButton
        text={`Continue`}
        textStyle={[{color:"white"}]}
        outerViewStyle={[{top:"10%"}]}
        isValid={true}
        validInnerGradientColors={["#00386C", "#0761B5"]}
        validOuterGradientColors={["#228DEF", "#023F78"]}
        onPress={()=>{ isLoggedIn ? navigation.navigate("Calendar") : navigation.navigate("Welcome") }}
      />
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold"
  },
})