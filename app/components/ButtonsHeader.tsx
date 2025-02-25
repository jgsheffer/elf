import { GradientButton } from "./GradientButton";
import { Image, ImageSourcePropType, SafeAreaView, View, StyleSheet, ImageStyle } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native"

interface ButtonHeaderProps {
  imageSourceLeftButton?: ImageSourcePropType | null;
  imageSourceRightButton?: ImageSourcePropType | null;
  isLeftGradient?: boolean | null;
  isRightGradient?: boolean | null;
  leftIconStyle?: ImageStyle | null;
  rightIconStyle?: ImageStyle | null;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

export const ButtonsHeader: React.FC<ButtonHeaderProps> = ({
  imageSourceLeftButton = null,
  imageSourceRightButton = null,
  onPressLeft = null,
  onPressRight = null,
  isLeftGradient = true,
  isRightGradient = true,
  leftIconStyle = null,
  rightIconStyle = null
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()

  return (
    <SafeAreaView style={[styles.safeArea, { top: insets.top }]}>
      <View
        style={[
          styles.iconRow,
          !imageSourceLeftButton && imageSourceRightButton
            ? styles.iconRowRightOnly
            : null,
        ]}
      >
        {imageSourceLeftButton && (
          isLeftGradient ? (
            <GradientButton
              outerViewStyle={[styles.iconButton]}
              isValid={true}
              validOuterGradientColors={["#FFFFFF", "#8FF550", "#0B6800"]}
              validInnerGradientColors={["#166200", "#166200"]}
              onPress={()=>{ onPressLeft ? onPressLeft() : null}}
              innerViewStyle={[
                {
                  borderRadius: 125,
                  paddingVertical: 0,
                  marginVertical: 0,
                  height: "100%",
                },
              ]}
            >
              <Image style={[styles.icon, leftIconStyle]} source={imageSourceLeftButton} />
            </GradientButton>
          ) : (
            <TouchableOpacity  style={[styles.iconContainerNoGradient, leftIconStyle]} onPress={()=>onPressLeft ? onPressLeft(): null}>
              <Image style={styles.iconNoGradient} source={imageSourceLeftButton} />
            </TouchableOpacity>
          )
        )}
        {imageSourceRightButton && (
          isRightGradient ? (
            <GradientButton
              outerViewStyle={[styles.iconButton]}
              isValid={true}
              validOuterGradientColors={["#FFFFFF", "#8FF550", "#0B6800"]}
              validInnerGradientColors={["#166200", "#166200"]}
              onPress={()=> onPressRight ? onPressRight() : null}
              innerViewStyle={[
                {
                  borderRadius: 125,
                  paddingVertical: 0,
                  marginVertical: 0,
                  height: "100%",
                },
              ]}
            >
              <Image style={[styles.icon, leftIconStyle]} source={imageSourceRightButton}  />
            </GradientButton>
          ) : (
            <TouchableOpacity  style={[styles.iconContainerNoGradient, rightIconStyle]} onPress={()=>navigation.goBack()}>
              <Image style={styles.iconNoGradient} source={imageSourceRightButton} />
            </TouchableOpacity>          
          )
        )}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 4,
    backgroundColor: 'transparent',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 4,
    marginTop: "2%",
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  iconRowRightOnly: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    margin: "0%",
    zIndex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  iconContainerNoGradient: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  iconNoGradient: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});