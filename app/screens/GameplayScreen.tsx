import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Image, Dimensions, Animated, Easing, Platform } from "react-native";
import { QuestionPanel } from "../components/QuestionPanel";
import { LocationGuessPanel } from "../components/LocationGuessPanel";
import { LocationUnlockedPanel } from "../components/LocationUnlockedPanel";
import { LocationDescriptionPanel } from "../components/LocationDescriptionPanel";
import { Elfie } from "../components/Elfie";
import Video, { VideoRef } from "react-native-video";
import { AuthContext } from "../contexts/AuthContext"
import { useRoute } from "@react-navigation/native"
import { Audio, AVPlaybackSource } from 'expo-av';
import { Level } from "../apiResponseTypes/levelType";
import { api } from "../services/api"
import { SingleChoiceQuestion } from "app/apiResponseTypes";
import { CompletedQuestion } from "app/apiResponseTypes/completedQuestionType";

enum GameplayState {
  Question = 0,
  LocationGuess = 1,
  ElfieInLocation = 2,
  LocationUnlocked = 3,
  LocationDescription = 4,
  ZoomIn = 5,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GameplayScreen = () => {
  const route = useRoute()
  const { level } = route.params;
  const currentLevel : Level = level as Level;
  
  const { user, activeChildProfileID, updateGameplayProgress } = useContext(AuthContext) || {};

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  // Constants for positioning based on screen size
  const ELFIE_VERTICAL_START = -SCREEN_HEIGHT * 0.01; // Start slightly off-screen
  const ELFIE_VERTICAL_UP = -SCREEN_HEIGHT * 0.25; // Move up 25% of the screen
  const ELFIE_VERTICAL_OUT = -SCREEN_HEIGHT * 1.25; // Fully out of view vertically
  const ELFIE_VERTICAL_CENTER = -SCREEN_HEIGHT * 0.5; // Center vertically
  const ELFIE_HORIZONTAL_START = -SCREEN_WIDTH * 0.5; // Start slightly off-screen
  const ELFIE_HORIZONTAL_CENTER = SCREEN_WIDTH * 0.25; // Center horizontally
  const ELFIE_HORIZONTAL_OUT = SCREEN_WIDTH * 1.25; // Off-screen horizontally
  const VIDEO_PLAY_DURATION = 4950; // ms per question

  const TOTAL_PLAYBACK_TIME = (VIDEO_PLAY_DURATION * (currentLevel.questions.length-1))/1000;

  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1);
  const [ elfieHorizontalPosition ] = useState(new Animated.Value(0));
  const [ elfieVerticalPosition ] = useState(new Animated.Value(ELFIE_VERTICAL_START));
  const [ elfieMoving, setElfieMoving ] = useState(false);
  const [ elfieAnimationIndex, setElfieAnimationIndex ] = useState(0);
  const [ textBoxMessage, setTextBoxMessage ] = useState<string | null>(null);
  const [ loopAnimation, setLoopAnimation ] = useState(false);
  const [ videoDuration, setVideoDuration ] = useState<number | null>(null);
  

  const findFirstUncompletedQuestionIndex = (
    questions: { id: string }[], 
    completedQuestions: CompletedQuestion[]
  ): number => {
    console.log("Questions:", questions.map(q => q.id)); // Log all question IDs
    console.log("Completed Questions:", completedQuestions); // Log all completed question IDs
  
    const index = questions.findIndex(question => {
      const isCompleted = completedQuestions.some(completed => completed.id === question.id);
      console.log(`Checking question ID: ${question.id}, isCompleted: ${isCompleted}`);
      return !isCompleted;
    });
  
    console.log("First Uncompleted Question Index:", index !== -1 ? index : 0);
    return index !== -1 ? index : 0; // Default to 0 if no uncompleted question is found
  };   

  const firstUncompletedQuestionIndex = React.useMemo(() => {
    console.log("Calculating first uncompleted question index...");
    return findFirstUncompletedQuestionIndex(
      currentLevel?.questions || [],
      currentLevel?.completedQuestions || []
    );
  }, [currentLevel?.questions, currentLevel?.completedQuestions]);
  
  const [state, setState] = useState({
    gameplayState:
      firstUncompletedQuestionIndex >= currentLevel?.questions.length - 1
        ? GameplayState.LocationGuess
        : GameplayState.Question,
    currentQuestionIndex: firstUncompletedQuestionIndex,
    isVideoPaused: true,
    videoTime: 0,
    isCorrectAnswer: undefined as boolean | undefined,
  });
  
  
  const videoRef = useRef<VideoRef>(null);

  const posSounds = [
    { file: require('../../assets/sounds/yeehaw.mp3'), text: 'Yeehaw' },
    { file: require('../../assets/sounds/yep.mp3'), text: 'Yep' },
    { file: require('../../assets/sounds/yahoo.mp3'), text: 'Yahoo' },
    { file: require('../../assets/sounds/woo_hoo.mp3'), text: 'Woo Hoo' },
  ];
  const negSounds = [
    { file: require('../../assets/sounds/try_again.mp3'), text: 'Try Again' },
    { file: require('../../assets/sounds/wrong_one.mp3'), text: 'Wrong One' },
    { file: require('../../assets/sounds/nope.mp3'), text: 'Nope' },
    { file: require('../../assets/sounds/not_that_one.mp3'), text: 'Not That One' },
  ];
  
  const elfieReaction = () => {

    if(state.isCorrectAnswer === undefined)
      return;

    let selectedSound;
    const randomIndex = state.isCorrectAnswer ? Math.floor(Math.random() * posSounds.length) : Math.floor(Math.random() * negSounds.length);
    selectedSound = state.isCorrectAnswer ? posSounds[randomIndex] : negSounds[randomIndex];

    if (state.gameplayState === GameplayState.Question) 
      setTextBoxMessage(selectedSound.text);

    async function playSound(file: AVPlaybackSource) {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
    
      // Cleanup after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status && status.isLoaded && !status.isBuffering) {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        }
      });
    }

    if(user?.preferences?.enable_sounds)
    {
      console.log(`Playing: ${selectedSound.text}`);
      playSound(selectedSound.file);
    }
  };

  useEffect(() => {
    if(state.gameplayState === GameplayState.LocationGuess)
      return
    
    if (state.isCorrectAnswer === false) {
      wrongAnswerAnimationElfie().then(() => {
        console.log("Movement complete.");
      });
    }
    else if(state.isCorrectAnswer)
    {
      updateProgress();
      correctAnswerAnimationElfie().then(() => {
        console.log("Movement complete.");
      });
    }
    else
    {
      setTextBoxMessage(null)
    }
  }, [state.isCorrectAnswer]);

  useEffect(() => {
    if (!elfieMoving) 
      setElfieAnimationIndex(0)
  }, [elfieMoving]);
  
  useEffect(() => {
    if (state.gameplayState === GameplayState.ElfieInLocation) {
      setTextBoxMessage("Welcome to " + currentLevel.name.en + ", " + currentLevel.country.name.en + "!")
      setTimeout(() => 
        {
          setTextBoxMessage(null);
          setState({ ...state, gameplayState: GameplayState.LocationUnlocked });
        }, 3000);
    }

  }, [state.gameplayState]);

  const handleQuestionAnswered = async (hasCorrectAnswer: boolean) => {

    setState((prevState) => ({
      ...prevState,
      isCorrectAnswer: hasCorrectAnswer,
    }));

    if (!hasCorrectAnswer || state.currentQuestionIndex >= currentLevel.questions.length-1) 
      return;

    console.log("Pause before video")
    await delay(4900);

    console.log("Play video")
    setState((prevState) => ({ 
      ...prevState, 
      gameplayState: GameplayState.ZoomIn,
      isVideoPaused: false 
    }));

    await delay(4950);
    console.log("Pause at location")
    setState((prevState) => ({ 
      ...prevState, 
      gameplayState: GameplayState.ZoomIn,
      isVideoPaused: true 
    }));
    await delay(2000);

    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex < currentLevel.questions.length-1) 
    {
      console.log("Go to next question")
      setState((prevState) => ({
        ...prevState,
        gameplayState: GameplayState.Question,
        currentQuestionIndex: nextIndex,
        isCorrectAnswer: undefined,
      }));
    }
    else 
    {
      console.log("Location Guess")
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: nextIndex,
        gameplayState: GameplayState.LocationGuess,
      }));
    }
  };

  const handleLocationGuess = async (selectionId: string) => {
    var singleChoiceQuestion = currentLevel.questions[state.currentQuestionIndex] as SingleChoiceQuestion;
    if (selectionId === singleChoiceQuestion.singleChoiceQuestionAnswer) 
    {
      updateProgress();
      setState((prevState) => ({ ...prevState, isCorrectAnswer: true}));
      await delay(2000);
      setState((prevState) => ({ ...prevState, gameplayState: GameplayState.ElfieInLocation }));
    }
  };
  
  // Adjusted Animation Functions
  const wrongAnswerAnimationElfie = async () => {
    
    setElfieMoving(true);
    console.log("Moving Elfie up and then down");

    await new Promise<void>((resolve) => {
      Animated.timing(elfieVerticalPosition, {
        toValue: ELFIE_VERTICAL_UP,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(async () => {
        console.log("Elfie moved up");
        resolve();
      });
    });

    const randomNumber = Math.random()%2;
    setElfieAnimationIndex(randomNumber === 0 ? 1 : 1);
    elfieReaction();

    if(Platform.OS === "android")
      await delay(2500);
    else
      await delay(3200);
  
    setState((prevState) => ({
      ...prevState,
      isCorrectAnswer: undefined,
    }));

    await new Promise<void>((resolve) => {
      Animated.timing(elfieVerticalPosition, {
        toValue: ELFIE_VERTICAL_START,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        console.log("Elfie returned to original position");
        resolve();
      });
    });

    setElfieMoving(false);
  };
  
  const correctAnswerAnimationElfie = async () => {
    setElfieMoving(true);
    console.log("Starting Elfie animation...");
  
    await delay(100);
  
    // Step 1: Move Elfie Up
    await new Promise<void>((resolve) => {
      Animated.timing(elfieVerticalPosition, {
        toValue: ELFIE_VERTICAL_UP,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        console.log("Elfie moved up by 100 units");
        resolve();
      });
    });
  
    const randomNumber = Math.random()%2;
    setElfieAnimationIndex(randomNumber === 0 ? 6 : 6);
    elfieReaction();

    if(Platform.OS === "android")
      await delay(1500);
    else
      await delay(1800);
  
    setState((prevState) => ({
      ...prevState,
      isCorrectAnswer: undefined,
    }));
    setElfieAnimationIndex(2);

    if(Platform.OS === "android")
      await delay(800);
    else
      await delay(1400);
  
    // Step 2: Move Elfie Out of View
    await new Promise<void>((resolve) => {
      Animated.timing(elfieVerticalPosition, {
        toValue: ELFIE_VERTICAL_OUT,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        console.log("Elfie moved up and out of view");
        resolve();
      });
    });
  
    await delay(500);
  
    // Step 3: Instantly Move to Top-Left
    elfieHorizontalPosition.setValue(ELFIE_HORIZONTAL_START);
    elfieVerticalPosition.setValue(-SCREEN_HEIGHT);
    console.log("Elfie instantly moved to the top-left corner");
    setLoopAnimation(true);
    setElfieAnimationIndex(3);
  
    await delay(500);
  
    // Step 4: Diagonal Move to Center
    await new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(elfieHorizontalPosition, {
          toValue: ELFIE_HORIZONTAL_CENTER,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(elfieVerticalPosition, {
          toValue: ELFIE_VERTICAL_CENTER,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log("Elfie moved diagonally to the center");
        resolve();
      });
    });
  
    await delay(1000);
  
    // Step 5: Animate Across the Screen
    await new Promise<void>((resolve) => {
      Animated.timing(elfieHorizontalPosition, {
        toValue: ELFIE_HORIZONTAL_OUT,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        console.log("Elfie exited to the right");
        resolve();
      });
    });

    setLoopAnimation(false);
    setElfieAnimationIndex(0);
    await delay(500);
  
    // Step 6: Return to Original Position
    elfieHorizontalPosition.setValue(0);
    elfieVerticalPosition.setValue(100);
  
    await new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(elfieVerticalPosition, {
          toValue: ELFIE_VERTICAL_START,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(elfieHorizontalPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log("Elfie returned to original position");
        resolve();
      });
    });
    setElfieMoving(false);
  };

  const videoAsset = () => {
    const asset = currentLevel?.country?.assets?.find((asset) => asset.type?.toLowerCase() === "video");
    return asset?.url;
  }

  const imageAsset = () => {
    const asset = currentLevel?.assets?.find((asset) => asset.role?.toLowerCase() === "map");
    return asset?.url;
  }

  const updateProgress = async () => {
    const completedLevel = currentLevel?.completedQuestions.find((qId)=>{ qId.id === currentLevel?.questions[state.currentQuestionIndex]?.id });
    if(completedLevel || !activeChildProfileID)
      return;
    
    await api.updateProgress(activeChildProfileID, currentLevel.id, currentLevel?.questions[state.currentQuestionIndex]?.id);
    if(updateGameplayProgress)
      updateGameplayProgress(currentLevel.id, currentLevel?.questions[state.currentQuestionIndex]?.id);
  }

  const handleVideoLoad = (data: { duration: number }) => {
    console.log("Video Loaded with duration of", data.duration);
    setVideoDuration(data.duration);

    // Calculate playback speed to ensure video ends after the last question
    const playbackRate = data.duration / TOTAL_PLAYBACK_TIME;
    console.log("Playback rate", playbackRate);
    setVideoPlaybackRate(playbackRate);

    // Seek to the correct time if resuming
    if (videoRef.current && currentLevel.questions.length > 0) {
      const seekTime = (data.duration / (currentLevel.questions.length-1)) * state.currentQuestionIndex;
      videoRef.current.seek(seekTime);
      console.log(`Seeking to ${seekTime} seconds for question index ${state.currentQuestionIndex}`);
    }
  };

  useEffect(() => {
    if (videoRef.current && videoDuration && currentLevel.questions.length > 0) {
      const seekTime = (videoDuration / (currentLevel.questions.length-1)) * state.currentQuestionIndex;
      videoRef.current.seek(seekTime);
      console.log(`Seeking to ${seekTime} seconds for question index ${state.currentQuestionIndex}`);
    }
  }, [state.currentQuestionIndex, videoDuration]);
  

  return (
    <View style={styles.container}>
      {state.currentQuestionIndex !== currentLevel?.questions.length && 
        <Video
          ref={videoRef}
          source={{ uri: videoAsset(), type:"video/mp4" }}
          style={[styles.video, StyleSheet.absoluteFill]}
          resizeMode="cover"
          paused={state.isVideoPaused}
          onLoad={handleVideoLoad}
          rate={videoPlaybackRate}
          onError={(error) => console.error("Video Load Error:", error)}
          onProgress={(data: { currentTime: number }) => setState({ ...state, videoTime: data.currentTime })}
        />
      }

      {state.currentQuestionIndex == currentLevel?.questions.length-1 && 
          <Image
            style={[styles.googleEarthImage]}
            source={{ uri: imageAsset() }}
          />
      }

      {state.gameplayState === GameplayState.Question && (
        <QuestionPanel
          isSubmitButtonValid={ !elfieMoving }
          onQuestionAnswered={(isCorrectAnswer: boolean) => handleQuestionAnswered(isCorrectAnswer)}
          questionNumber={state.currentQuestionIndex}
          question={currentLevel?.questions[state.currentQuestionIndex]}
        />
      )}

      {state.gameplayState === GameplayState.LocationGuess && (
        <LocationGuessPanel
          onLocationGuessSelection={handleLocationGuess}
          question={currentLevel?.questions[state.currentQuestionIndex] as SingleChoiceQuestion}
        />
      )}

      {state.gameplayState === GameplayState.LocationUnlocked && (
        <LocationUnlockedPanel
          onNextClicked={() => setState({ ...state, gameplayState: GameplayState.LocationDescription })}
          level={currentLevel}
        />
      )}

      {state.gameplayState === GameplayState.LocationDescription && <LocationDescriptionPanel 
          level={currentLevel}
        />}

        <Animated.View
          pointerEvents="none"
          style={[
            state.gameplayState === GameplayState.ElfieInLocation
              ? [styles.elfieMiddle, {bottom: SCREEN_HEIGHT*.2, left: SCREEN_HEIGHT*.01,}]
              : [styles.elfieCorner, {bottom: -SCREEN_HEIGHT/4, left: -SCREEN_HEIGHT/10, }],
            {
              transform: [
                { translateY: elfieVerticalPosition },
                { translateX: elfieHorizontalPosition }, 
              ],
            },
          ]}
        >
        <Elfie
          zIndex={0}
          animationIndex={elfieAnimationIndex}
          textBoxMessage={textBoxMessage}
          loopAnimation={loopAnimation}
          style={[ state.gameplayState === GameplayState.ElfieInLocation ? {width:"75%", height: "75%"} : {width:"90%", height: "90%"} ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  elfieCorner: {
    bottom: "-30%",
    left: "-22%",
    position: "absolute",
  },
  elfieMiddle: {
    position: "absolute",
  },
  googleEarthImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    position: "absolute",
    zIndex: 0
  },
  video: {
  },
});
