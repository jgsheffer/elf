import { StyleSheet, View, Text } from 'react-native';
import React, { useState, useRef } from "react";
import { DraggableTerm } from "./DraggableTerm";
import { MatchQuestion } from "../apiResponseTypes/questionType";

interface MatchGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: MatchQuestion;
}

type DropZone = { px: number; py: number; width: number; height: number };
type DropZonesType = Record<string, DropZone | null>;
type MatchesType = { [key: string]: string | null; };

export const MatchGameplay : React.FC<MatchGameplayProps> = ({ onQuestionAnswered, question })=> {
  const refs = useRef<React.RefObject<View>[]>([]); 
  const dropZones = useRef<DropZonesType>({});
  const [isDraggingTerm, setIsDraggingTerm] = useState(false);

  const [matches, setMatches] = useState<MatchesType>(() => {
    return question?.matchAnswers?.en
      ? Object.fromEntries(
        question?.matchAnswers?.en.map(([_, englishWord]) => [englishWord, null])
        )
      : {};
  });
  const [remainingTerms, setRemainingTerms] = useState<string[]>(
    question?.matchAnswers?.en.map(([foreignWord]) => foreignWord) || []
  );

const handleDrop = (
  term: string,
  x: number,
  y: number,
  itemOffsetX: number, 
  itemOffsetY: number, 
  itemWidth: number,
  itemHeight: number,
  resetPosition: () => void
) => {
  let correctDrop = false;

  Object.keys(dropZones.current || {}).forEach((key) => {
    const zone = dropZones.current![key];

    if (zone) {
      const draggableBounds = {
        left: x - itemOffsetX,
        right: x - itemOffsetX + itemWidth,
        top: y - itemOffsetY,
        bottom: y - itemOffsetY + itemHeight,
      };

      console.log("OffsetX" , itemOffsetX, "X" ,x, "Width", itemWidth, "OffsetY" , itemOffsetY, "Y" , y, "Height", itemHeight, "\n")

      const dropZoneBounds = {
        left: zone.px,
        right: zone.px + zone.width,
        top: zone.py,
        bottom: zone.py + zone.height,
      };

      const isOverlapping =
        draggableBounds.right > dropZoneBounds.left &&
        draggableBounds.left < dropZoneBounds.right &&
        draggableBounds.bottom > dropZoneBounds.top &&
        draggableBounds.top < dropZoneBounds.bottom;

      console.log("ItemR" , draggableBounds.right, "DropL" ,dropZoneBounds.left, "ItemL" ,draggableBounds.left, "DropR" ,dropZoneBounds.right, "ItemB" ,draggableBounds.bottom, "DropB" ,dropZoneBounds.top, "ItemT" ,draggableBounds.top, "DropT" ,dropZoneBounds.bottom, "\n")

      if (isOverlapping) {
        if (question?.matchAnswers?.en.some(([foreign, english]) => foreign === term && english === key)) {
          setMatches((prev) => ({
            ...prev,
            [key]: term,
          }));
          setRemainingTerms((prev) => prev.filter((t) => t !== term));
          correctDrop = true;
        }
      }
    }
  });

  if (!correctDrop) {
    resetPosition();
  }

  const totalMatches = Object.values(matches).filter((value) => value !== null).length + (correctDrop ? 1 : 0);
  const totalAnswers = question?.matchAnswers?.en.length || 0;
  const allCorrect = totalMatches === totalAnswers;

  if (allCorrect) {
    onQuestionAnswered(true);
  }
};

  
const renderDropRows = () => {
  return Object.keys(matches).map((englishWord, index) => {

    if (!refs.current[index]) {
      refs.current[index] = React.createRef<View>();
    }

    return (
      <View key={index} style={styles.row}>
        <Text adjustsFontSizeToFit style={styles.englishTerm}>{englishWord}</Text>
        <View
          ref={refs.current[index]} 
          style={[styles.dropZone, matches[englishWord] ? { backgroundColor: "#0761B5" } : (isDraggingTerm ? { backgroundColor: "#FFFFFF" } : { backgroundColor: "#AAAAAA" }) ]}
          onLayout={() => {
            const ref = refs.current[index]?.current;
            if (ref) 
            {
              ref.measure((fx, fy, width, height, px, py) => {
                setTimeout(() => {
                  dropZones.current[englishWord] = { px, py, width, height };
                  console.log(`Measured ${englishWord}:`, { px, py, width, height });
                }, 0);
              });
            }
          }}
        >
          <Text style={styles.matchText}>{matches[englishWord]}</Text>
        </View>
      </View>
    );
  });
};

const renderDraggableTerms = () => {
  return (
    <View style={[styles.row]}>
      {remainingTerms.map((term, index) => (
        <DraggableTerm
          key={`${term}-${index}`}
          term={term}
          handleDrop={(term, x, y, offsetX, offsetY, resetPosition) => {
            const width = 70; 
            const height = 40; 
            handleDrop(term, x, y, offsetX, offsetY, width, height, resetPosition);
          }}
          handleDrag={(isDragging:boolean)=>setIsDraggingTerm(isDragging)}
          startX={0} 
          startY={0}
        />
      ))}
    </View>
  );
};

return (
  <View>
    {renderDropRows()}
    {renderDraggableTerms()}
</View>
);
};

const styles = StyleSheet.create({
  englishTerm: {
    width: 120,
  },
  matchText: {
    color: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  dropZone: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000",
    marginLeft: 0,
    borderRadius: 8,
  },
  dropContainer: {
    marginVertical: 20,
  },
  draggableContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 0,
  },
});
