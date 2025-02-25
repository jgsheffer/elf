import React, { useState } from "react"
import { GradientContainerScrollable } from "../components/GradientContainerScrollable"
import { StyleSheet, View, Text, Modal, TouchableOpacity, Alert } from "react-native"
import { GradientButton } from "app/components/GradientButton"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { iapManager } from "../services/api/IapManager"

import { useAuth } from "../contexts/AuthContext"
import { Elfie } from "../components/Elfie"
import { formatDate } from "../utils/formatDate"
import DeviceInfo from 'react-native-device-info'
import { hairIconData, skinColorIconData, outfitIconData, genderIconData } from "../data/ElfieCustomizationData";
import { colors } from "../theme";
import { TruncatedText } from "../components/TruncatedText";

export const ProfileScreen = () => {
  const route = useRoute()
  const { profileCreated } = route.params || {}
  const navigation = useNavigation()

  const isbetaBuild = true

  const [modalVisible, setModalVisible] = useState(false)

  const { user, activeChildProfileID, syncUser } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const sync = async () => {
        try {
          await syncUser(false);
        } catch (error) {
          console.error("Error loading children from storage:", error);
        }
      }

      sync();
    }, []),
  )

  const handleSubscribePress = async () => {
    setModalVisible(true)
  }

  const handlePlayPress = async () => {
    const emulator = await DeviceInfo.isEmulator()
    if(activeChildProfileID)//emulator)//Platform.OS == "ios")//user.id === "9d955af5-62a1-43c7-a4ab-a43b7ed7a42d")
    {
      navigation.navigate("Calendar")
      return
    }
    else
    {
      Alert.alert("Wait", "You must set an active profile!")
      return;
    }

    const hasSubscription = await iapManager.checkActiveSubscription()
    if (hasSubscription) 
    {
      navigation.navigate("Calendar")
    } 
    else 
    {
      setModalVisible(true)
    }
  }

  const handleSubscribe = async (level: number) => {
    const result = await iapManager.purchaseSubscription(level)
    if (result) {
      setModalVisible(false) 
      navigation.navigate("Calendar")
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false) 
  } 

  return (
    <GradientContainerScrollable
      showLogOutButton={true}
      title="Profiles"
      showBackButton={false}
      showRightButton={true}
    >
      <StatusBar backgroundColor="#0065DB" />
      {profileCreated && (
        <Text style={[{ marginBottom: 20 }]}>
          Your child’s profile is all set! You can manage their information, review activity, or
          update preferences anytime from here.
        </Text>
      )}

      {user && user?.children?.data.length > 0 ? (
        user?.children?.data.map((child) => {
          const isActive = child.id === activeChildProfileID
          return (
            <GradientButton
              key={child.id}
              onPress={() => {
                navigation.navigate("UpdateProfile", { child })
              }}
            >
              <View style={styles.profileInfoContainer}>
                {isActive && (
                  <View style={styles.activeLabel}>
                    <Text style={styles.activeLabelText}>ACTIVE</Text>
                  </View>
                )}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarCircle} />
                  <Elfie
                    style={[styles.elfContainer]}
                    elfieStyle={[styles.elfImage]}
                    maskStyle={[styles.elfMask]}
                    hairIndex={hairIconData.findIndex(
                      (item) => item.uuid === child.character?.skin?.hair_style,
                    )}
                    colorIndex={skinColorIconData.findIndex(
                      (item) => item.uuid === child.character?.skin?.color,
                    )}
                    outfitIndex={outfitIconData.findIndex(
                      (item) => item.uuid === child.character?.skin?.outfit,
                    )}
                    genderIndex={genderIconData.findIndex(
                      (item) => item.uuid === child.character?.skin?.gender,
                    )}
                    zIndex={0}
                  />
                </View>
                <View style={styles.nameAgeContainer}>
                  <TruncatedText
                    text={child?.firstname ? child?.firstname : ""}
                    maxLength={12}
                    style={styles.nameText}
                  />
                  <Text style={styles.ageText}>
                    {formatDate(child.date_of_birth, "MM/dd/yyyy")}
                  </Text>
                </View>
              </View>
            </GradientButton>
          )
        })
      ) : (
        <Text style={styles.infoText}>
          No profiles found. Create a profile to get started!
        </Text>
      )}


      <GradientButton
        text={"+"}
        onPress={() => {
          navigation.navigate("CreateProfile")
        }}
        textStyle={[styles.plusSign]}
        outerViewStyle={[styles.plusOuterViewStyle]}
      />
      { <GradientButton
        text={"Play"}
        onPress={handlePlayPress}
        outerViewStyle={[{ justifyContent: "flex-end" }]}
      />}

      {/* Spacer */}
      <View style={{ height: 50 }} />
      
      {false && <GradientButton text={"+"} onPress={() => { navigation.navigate("CreateProfile") }} textStyle={ [styles.plusSign] } outerViewStyle={ [styles.plusOuterViewStyle] } />}
      {false && <GradientButton text={"Subscribe"} onPress={handleSubscribePress} outerViewStyle={[{ justifyContent: "flex-end", marginTop:0, marginBottom:0 }]} />}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Subscribe</Text>
            <Text style={styles.modalMessage}>
              A subscription is required to play. Would you like to subscribe now?
            </Text>

            <View style={styles.modalButtonsContainer}>
              <View style={styles.subscribeRow}>
                <Text style={styles.modalText}>Base Member</Text>
                <TouchableOpacity style={styles.modalButton} onPress={()=>handleSubscribe(0)}>
                  <Text style={styles.modalButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.subscribeRow}>
                <Text style={styles.modalText}>Tier 1 Member</Text>
                <TouchableOpacity style={styles.modalButton} onPress={()=>handleSubscribe(1)}>
                  <Text style={styles.modalButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.subscribeRow}>
                <Text style={styles.modalText}>Tier 2 Member</Text>
                <TouchableOpacity style={styles.modalButton} onPress={()=>handleSubscribe(2)}>
                  <Text style={styles.modalButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </GradientContainerScrollable>
  )
}

const styles = StyleSheet.create({
  plusOuterViewStyle: {
    width: "35%",
  },
  plusSign: {
    fontSize: 40,
    color: "black",
    fontWeight: "bold",
  },
  profileInfoContainer: {
    flexDirection: "row",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  elfContainer: {
    position: "absolute",
    width: 60,
    height: 60,
  },
  elfImage: {
    width: 150,
    height: 150,
    top: -10,
  },
  elfMask: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C1C1C1AA",
  },
  nameAgeContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  ageText: {
    fontSize: 16,
    color: "#000",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
  },
  subscribeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#0065DB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalText: {
    color: "#000000",
    fontSize: 16,
  },
  activeLabel: {
    backgroundColor: colors.palette.green,
    padding: 5,
    borderRadius: 5,
    transform: [{ rotate: "270deg" }],
  },
  activeLabelText: {
    fontSize: 10,
    textTransform: "uppercase",
    color: colors.palette.white,
    fontWeight: "bold",
  },
})