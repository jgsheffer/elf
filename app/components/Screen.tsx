import { useScrollToTop } from "@react-navigation/native"
import { StatusBar, StatusBarProps } from "expo-status-bar"
import React, { useRef } from "react"
import {
  ImageBackground, 
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native"
import { colors } from "../theme"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

interface BaseScreenProps {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  safeAreaEdges?: ExtendedEdge[]
  backgroundColor?: string
  statusBarStyle?: "light" | "dark"
  keyboardOffset?: number
  StatusBarProps?: StatusBarProps
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps
  imageSource?: any // New prop for optional background image
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: "fixed"
}

interface ScrollScreenProps extends BaseScreenProps {
  preset?: "scroll"
  keyboardShouldPersistTaps?: "handled" | "always" | "never"
  ScrollViewProps?: ScrollViewProps
}

interface AutoScreenProps extends Omit<ScrollScreenProps, "preset"> {
  preset?: "auto"
  scrollEnabledToggleThreshold?: { percent?: number; point?: number }
}

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps

const isIos = Platform.OS === "ios"

type ScreenPreset = "fixed" | "scroll" | "auto"

function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === "fixed"
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const { style, contentContainerStyle, children } = props
  return (
    <View style={[$outerStyle, style]}>
      <View style={[$innerStyle, contentContainerStyle]}>{children}</View>
    </View>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = "handled",
    contentContainerStyle,
    ScrollViewProps,
    style,
  } = props as ScrollScreenProps

  const ref = useRef<ScrollView>(null)

  useScrollToTop(ref)

  return (
    <ScrollView
      {...{ keyboardShouldPersistTaps, ref }}
      {...ScrollViewProps}
      style={[$outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  )
}

export function Screen(props: ScreenProps) {
  const {
    backgroundColor = colors.background,
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle = "dark",
    imageSource, // Add the imageSource prop here
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)

  const ScreenContent = isNonScrolling(props.preset) ? (
    <ScreenWithoutScrolling {...props} />
  ) : (
    <ScreenWithScrolling {...props} />
  )

  return (
    <View style={[$containerStyle, { backgroundColor }, $containerInsets]}>
      <StatusBar style={statusBarStyle} {...StatusBarProps} />

      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[$keyboardAvoidingViewStyle, KeyboardAvoidingViewProps?.style]}
      >
        {imageSource ? (
          <ImageBackground source={imageSource} style={{ flex: 1 }}>
            {ScreenContent}
          </ImageBackground>
        ) : (
          ScreenContent
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

const $containerStyle: ViewStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
}

const $keyboardAvoidingViewStyle: ViewStyle = {
  flex: 1,
}

const $outerStyle: ViewStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
}

const $innerStyle: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "stretch",
}
