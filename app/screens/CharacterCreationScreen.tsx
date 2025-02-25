import React, { useState } from "react";
import { useNavigation, useRoute, } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { GradientButton } from "../components/GradientButton";
import { colors } from "../theme";
import { hairIconData, skinColorIconData, outfitIconData, genderIconData } from "../data/ElfieCustomizationData";
import { save } from "../utils/storage/storage";
import { api } from "app/services/api"
import { LottieLoader } from "../components/LottieLoader"
import {Elfie} from "../components/Elfie" 
import { useAuth } from "../contexts/AuthContext"

export const CharacterCreationScreen = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation();
  const route = useRoute();
  const { setActiveChildProfileID, updateSkin } = useAuth()

  // Retrieve child data from route params
  const { child } = route.params || {};
  const { character } = child || {};
  const { skin } = character || {};

  enum ButtonState {
    Hair = "hair",
    Skin = "color",
    Outfit = "outfit",
    Gender = "gender",
  }

  const validOuterGradientColors = ["#84C75A", "#004E02"];
  const validInnerGradientColors = ["#FA0017", "#FA0017"];
  const validOuterGradientTransparentColors = ["#76FF03", "#76FF03"];
  const validInnerGradientTransparentColors = ["#76FF03", "#76FF03"];

  const [activeButton, setActiveButton] = useState<ButtonState>(ButtonState.Hair)

  const isValidUUID = (uuid:string, data) => data.some((item) => item.uuid === uuid)

  const [lastSelectedHairUUID, setLastSelectedHairUUID] = useState<string>(
    isValidUUID(skin?.hair_style, hairIconData) ? skin.hair_style : hairIconData[0].uuid,
  )

  const [lastSelectedSkinUUID, setLastSelectedSkinUUID] = useState<string>(
    isValidUUID(skin?.color, skinColorIconData) ? skin.color : skinColorIconData[0].uuid,
  )

  const [lastSelectedOutfitUUID, setLastSelectedOutfitUUID] = useState<string>(
    isValidUUID(skin?.outfit, outfitIconData) ? skin.outfit : outfitIconData[0].uuid,
  )

  const [lastSelectedGenderUUID, setLastSelectedGenderUUID] = useState<string>(
    isValidUUID(skin?.gender, genderIconData) ? skin.gender : genderIconData[0].uuid,
  )

  const [elfieName, setElfieName] = useState<string>(character?.name || "")


  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.updateSkin(
        child.id,
        elfieName || "Elfie",
        lastSelectedGenderUUID,
        lastSelectedHairUUID,
        lastSelectedSkinUUID,
        lastSelectedOutfitUUID
      )

      await updateSkin(child.id, elfieName || "Elfie", lastSelectedGenderUUID, lastSelectedHairUUID, lastSelectedSkinUUID, lastSelectedOutfitUUID);
      console.log("setActiveChildProfileID handleSubmit")
      setActiveChildProfileID(child.id);
      navigation.navigate("Profile")
    } catch (error) {
      console.error("Error saving character:", error)
      Alert.alert("Error", "Failed to save character. Please try again.")
    }

    setLoading(false)
  }

  const renderContent = () => {
    return (
    <View style={styles.container}>
        <Elfie
          style={[styles.elfie]}
          hairIndex={hairIconData.findIndex((item) => item.uuid === lastSelectedHairUUID)}
          colorIndex={skinColorIconData.findIndex((item) => item.uuid === lastSelectedSkinUUID)}
          outfitIndex={outfitIconData.findIndex((item) => item.uuid === lastSelectedOutfitUUID)}
          genderIndex={genderIconData.findIndex((item) => item.uuid === lastSelectedGenderUUID)}
          zIndex={0}
          animationIndex={0}
        />

        <Image source={require("../../assets/images/disc.png")} style={styles.discImage} />

        <LinearGradient colors={["#2E7D32", "#69F0AE"]} style={styles.gradientNameBarOuter}>
          <View style={styles.gradientNameBarInner}>
            <TextInput
              style={styles.nameText}
              placeholder="Elf Name"
              placeholderTextColor={colors.palette.white}
              onChangeText={(name) => setElfieName(name)}
              value={elfieName}
            />
            <Image source={require("../../assets/icons/edit_icon.png")} style={styles.editIcon} />
          </View>
        </LinearGradient>

        <LinearGradient colors={["#2E7D32", "#69F0AE"]} style={styles.gradientSelectionBarOuter}>
          <View style={styles.gradientSelectionBarInner}>
            {/*Hair type button*/}
            <GradientButton
              outerViewStyle={[styles.hairButtonOuterView]}
              innerViewStyle={[styles.hairButtonInnerView]}
              imageStyle={[styles.hairButtonImage]}
              text={null}
              imageSource={require("../../assets/icons/hair_icon.png")}
              validOuterGradientColors={activeButton === ButtonState.Hair ? validOuterGradientColors : validOuterGradientTransparentColors }
              validInnerGradientColors={activeButton === ButtonState.Hair ? validInnerGradientColors : validInnerGradientTransparentColors }
              onPress={() => {
                setActiveButton(ButtonState.Hair);
              }}
            />
            {/*Skin color type button*/}
            <GradientButton
              outerViewStyle={[styles.colorButtonOuterView]}
              innerViewStyle={[styles.colorButtonInnerView]}
              imageStyle={[styles.colorButtonImage]}
              text={null}
              imageSource={require("../../assets/icons/color_icon.png")}
              validOuterGradientColors={activeButton === ButtonState.Skin ? validOuterGradientColors : validOuterGradientTransparentColors }
              validInnerGradientColors={activeButton === ButtonState.Skin ? validInnerGradientColors : validInnerGradientTransparentColors }
              onPress={() => {
                setActiveButton(ButtonState.Skin);
              }}
            />
            {/*Clothes type button*/}
            <GradientButton
              outerViewStyle={[styles.outfitButtonOuterView]}
              innerViewStyle={[styles.outfitButtonInnerView]}
              imageStyle={[styles.outfitButtonImage]}
              text={null}
              imageSource={require("../../assets/icons/tshirt_icon.png")}
              validOuterGradientColors={activeButton === ButtonState.Outfit ? validOuterGradientColors : validOuterGradientTransparentColors }
              validInnerGradientColors={activeButton === ButtonState.Outfit ? validInnerGradientColors : validInnerGradientTransparentColors }
              onPress={() => {
                setActiveButton(ButtonState.Outfit);
              }}
            />
            <GradientButton
              outerViewStyle={[styles.outfitButtonOuterView]}
              innerViewStyle={[styles.outfitButtonInnerView]}
              imageStyle={[styles.genderButtonImage]}
              text={null}
              imageSource={require("../../assets/icons/gender_icon.png")}
              validOuterGradientColors={activeButton === ButtonState.Gender ? validOuterGradientColors : validOuterGradientTransparentColors }
              validInnerGradientColors={activeButton === ButtonState.Gender ? validInnerGradientColors : validInnerGradientTransparentColors }
              onPress={() => {
                setActiveButton(ButtonState.Gender);
              }}
            />
          </View>

        </LinearGradient>

        <View style={styles.scrollContainer}>
          <ScrollView>
            <View style={styles.gridContainer}>{renderButtonsData()}</View>
          </ScrollView>
        </View>
      </View>)
  }

  const renderButtonsData = () => {
    let data, delegate, selectedUUID;

    if (activeButton === ButtonState.Hair) {
      data = hairIconData;
      delegate = (uuid: string) => setLastSelectedHairUUID(uuid);
      selectedUUID = lastSelectedHairUUID;
    } else if (activeButton === ButtonState.Skin) {
      data = skinColorIconData;
      delegate = (uuid: string) => setLastSelectedSkinUUID(uuid);
      selectedUUID = lastSelectedSkinUUID;
    } else if (activeButton === ButtonState.Outfit) {
      data = outfitIconData;
      delegate = (uuid: string) => setLastSelectedOutfitUUID(uuid);
      selectedUUID = lastSelectedOutfitUUID;
    } else {
      data = genderIconData;
      delegate = (uuid: string) => setLastSelectedGenderUUID(uuid);
      selectedUUID = lastSelectedGenderUUID;
    }

    return data.map((d) => (
      <GradientButton
        key={d.uuid}
        text={null}
        onPress={() => delegate(d.uuid)}
        outerViewStyle={[styles.button]}
        innerViewStyle={[{ height: "100%" }, { width: "100%" }]}
        imageStyle={[{ height: "140%" }, { width: "140%" }]}
        imageSource={d.icon}
        validOuterGradientColors={selectedUUID === d.uuid ? ["#93F296", "#FFFFFF"] : ["#0D7510", "#84C75A"]}
        validInnerGradientColors={d.color ? [d.color, d.color] : ["#103C00", "#27E32F"]}
      />
    ));
  };

  return (
    <LinearGradient colors={["#103C00", "#27E32F"]} style={styles.bgGradient}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require("../../assets/images/icon-back.png")} style={styles.backArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.checkButton} onPress={handleSubmit}>
        <Image source={require("../../assets/images/icon-check.png")} style={styles.checkMark} />
      </TouchableOpacity>

      <LottieLoader visible={loading} />

      {Platform.OS === 'ios'?
        <KeyboardAvoidingView
          behavior={'padding'}
          style={[styles.keyboardAvoidingView]}
        >
          {renderContent()}
        </KeyboardAvoidingView>  
          : 
        <>
          {renderContent()}
        </>
      }
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  keyboardAvoidingView:
  {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  bgGradient: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    top: "5%",
    flex: 1,
    justifyContent: "center",
  },
  elfie:{
    top:"7%",
    width:"44%",
    height:"44%"
  },
  discImage: {
    width: "80%",
    height: "15%",
    resizeMode: "contain",
  },
  gradientSelectionBarOuter: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    height: '6%',
    width: '80%',
    marginVertical: "1%",
  },
  gradientSelectionBarInner: {
    borderRadius: 100,
    backgroundColor: '#76FF03',
    height: '90%',
    width: '98%',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gradientNameBarOuter: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    height: '6%',
    width: '80%',
    marginVertical: 5,
    marginTop: -20,
  },
  gradientNameBarInner: {
    borderRadius: 100,
    backgroundColor: '#166200',
    height: '90%',
    width: '98%',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "1%",
  },
  nameEditButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  nameText: {
    fontSize: 22,
    color: colors.palette.white,
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
  },
  editIcon: {
    right: 10,
    padding: 10,
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  scrollContainer: {
    flex: 1,
    width: '90%',
    maxHeight: "20%"
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    flexGrow: 1
  },
  button: {
    width: "27%",
    height: "27%",
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: "1%"
  },
  buttonImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 22,
  },
  backArrow: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  checkButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 22,
  },
  checkMark: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  hairButtonOuterView: {
    width: "25%",
    marginVertical: 0,
  },
  hairButtonInnerView: {
    paddingVertical: 0,
  },
  hairButtonImage: {
    width: "50%",
    height: "100%",
  },
  colorButtonOuterView: {
    width: "25%",
    marginVertical: 0,
  },
  colorButtonInnerView: {
    paddingVertical: 0,
  },
  colorButtonImage: {
    width: "57%",
    height: "100%",
  },
  outfitButtonOuterView: {
    width: "25%",
    marginVertical: 0,
  },
  outfitButtonInnerView: {
    paddingVertical: 0,
  },
  outfitButtonImage: {
    width: "50%",
    height: "100%",
  },
  genderButtonImage: {
    width: "50%",
    height: "100%",
  },
});