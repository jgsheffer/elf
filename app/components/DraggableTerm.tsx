import React, { useRef } from "react";
import { Text, Animated, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

export const DraggableTerm: React.FC<{
  term: string;
  handleDrop: (term: string, x: number, y: number, offsetX: number, offsetY: number, resetPosition: () => void) => void;
  startX: number;
  startY: number;
  handleDrag: (isDragging: boolean) => void;
}> = ({ term, handleDrop, startX, startY, handleDrag }) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;

  const touchOffsetX = useRef(0);
  const touchOffsetY = useRef(0);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      handleDrag(true);
      touchOffsetX.current = event.nativeEvent.x;
      touchOffsetY.current = event.nativeEvent.y;
    }
  
    if (event.nativeEvent.state === State.END) {
      handleDrag(false);
      handleDrop(
        term,
        event.nativeEvent.absoluteX,
        event.nativeEvent.absoluteY,
        touchOffsetX.current,
        touchOffsetY.current,
        () => {
          Animated.timing(translateX, {
            toValue: startX,
            duration: 300,
            useNativeDriver: false,
          }).start();
          Animated.timing(translateY, {
            toValue: startY,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      );
    }
  };

  return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.draggable,
            {
              transform: [{ translateX }, { translateY }],
            },
          ]}
        >
          <Text style={styles.text}>{term}</Text>
        </Animated.View>
      </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  draggable: {
    width: 70,
    height: 40,
    backgroundColor: "#0761B5",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 8,
  },
  text: {
    color: "#FFFFFF",
  },
});