import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';

interface BrowserLinkProps {
  url: string;
  text: string;
  color: string
}

export const BrowserLink: React.FC<BrowserLinkProps> = ({ url, text, color }) => {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(url); // Check if URL can be opened
      if (supported) {
        await Linking.openURL(url); // Open the URL in the browser
      } else {
        Alert.alert(`Cannot open this URL: ${url}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.linkText, {color:color}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 10
  },
});