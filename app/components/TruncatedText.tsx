import React from "react"
import { Text, TextProps } from "react-native"

interface TruncatedTextProps extends TextProps {
  text: string
  maxLength: number
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength, ...props }) => {
  const trimmedText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  return <Text {...props}>{trimmedText}</Text>
}
