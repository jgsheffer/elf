import React from 'react';
import { View, Image, StyleSheet, Dimensions, ViewStyle } from 'react-native';

interface IconInCircleProps {
  imageSource: any; 
  diameter?: string; 
  backgroundColor?: string; 
  style?: ViewStyle[] | null;
}

export const IconInCircle: React.FC<IconInCircleProps> = ({
  imageSource,
  diameter = '100%',
  backgroundColor = 'red',
  style = null,
}) => {
  const windowWidth = Dimensions.get('window').width; // Get the width of the window
  const calculatedDiameter = parseFloat(diameter) / 100 * windowWidth; // Calculate the diameter based on the window width

  return (
    <View style={[styles.circle, style,{ 
      width: calculatedDiameter, 
      height: calculatedDiameter, 
      borderRadius: calculatedDiameter / 2, 
      backgroundColor 
    }]}>
      <Image
        source={imageSource}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '50%',
    height: '50%',
  },
});