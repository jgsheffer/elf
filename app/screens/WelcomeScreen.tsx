import React, { useState } from "react"
import { Text, Modal, View, StyleSheet, Button } from "react-native"
import { GradientContainer } from "../components/GradientContainer"
import { GradientButton } from "../components/GradientButton"
import { useNavigation } from "@react-navigation/native"

export const WelcomeScreen = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleClosePopup = () => {
    setModalVisible(false);
    navigation.navigate('Parent');
  };

  return (
    <GradientContainer title="WELCOME!">
      <GradientButton text="I'M A KID" onPress={ () => setModalVisible(true) } />
      <GradientButton text="I'M A PARENT" onPress={ () => navigation.navigate("Parent") } />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClosePopup}
        animationType="none"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>
            Hey there! Before we go any further, we need to get permission from your parent or
             guardian. Please have them help you with the next steps!
            </Text>
            <View style={styles.buttonContainer}>
            <View style={styles.buttonSpacing}>
              <Button title="Continue as a Parent" onPress={handleClosePopup} />
            </View>
            <View style={styles.buttonSpacing}>
              <Button title="Go Back" onPress={() => setModalVisible(false)} />
            </View>
          </View>
          </View>
        </View>
      </Modal>

    </GradientContainer>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'column',
  },
  buttonSpacing: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});