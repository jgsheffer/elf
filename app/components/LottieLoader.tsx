import React from "react"
import { StyleSheet, View, Modal } from "react-native"
import LottieView from "lottie-react-native"
import animationSource from "../../assets/animations/loading.json" // Hardcoded animation

export const LottieLoader = ({ visible, overlayColor = "rgba(0, 0, 0, 0.5)" }) => {
  if (!visible) return null

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <LottieView
          source={animationSource} // Always use this animation
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  animation: {
    width: 150,
    height: 150,
  },
})
