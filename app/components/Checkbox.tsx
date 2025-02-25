import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from "react-native-linear-gradient"

export const Checkbox = ({ isChecked, onPress, width = 32, height = 30 }) => {
  const [checked, setChecked] = useState(isChecked);

  const handlePress = () => {
    setChecked(!checked);
    if (onPress) {
      onPress(!checked);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginVertical: 2 }}>
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={[styles.containerGradient, { borderRadius: height * 0.4 }]}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={[styles.innerGradient, { borderRadius: height * 0.4 }]}>
          <View style={[styles.checkbox, { width, height, borderRadius: height * 0.4 }, checked && styles.checked]}>
            {checked && (
              <Image
                source={require('../../assets/icons/check_icon.png')}
                style={{ width: height * 1.1, height: height * 1.1 }}
                resizeMode="contain"
              />
            )}
          </View>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: '#D7F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A1E2FF',
  },
  checked: {
    backgroundColor: '#D7F2FF',
  },
  containerGradient: {
    padding: 3,
    width: "100%",
    minHeight: 25
  },
  innerGradient: {
    justifyContent: "center",
    width: "100%",
  },
});
