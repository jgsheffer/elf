import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "app/contexts/AuthContext";
import { ButtonsHeader } from "app/components/ButtonsHeader";
import { getPresignedUrl } from "../services/api/awsConfig"; 
import { Level } from "app/apiResponseTypes";

export const GlobeAndroidScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, levels = [] } = useContext(AuthContext) || {};
  const { level } = route.params;
  const webviewRef = useRef(null);

  const [markerElfImageUrl, setMarkerElfImageUrl] = useState<string | null>(null);
  const [markerElfLockedImageUrl, setMarkerElfLockedImageUrl] = useState<string | null>(null);
  const [markersJson, setMarkersJson] = useState<string>("[]"); // Default to empty array

  const compareDates = (date1: Date, date2: Date): "equal" | "greater" | "less" => {
    // Normalize dates by setting the time to 00:00:00.000
    const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    //console.log("normalizedDate1", normalizedDate1, "normalizedDate2", normalizedDate2);
    // Compare normalized timestamps
    if (normalizedDate1.getTime() === normalizedDate2.getTime()) {
      return "equal"; // Dates are the same (year, month, day)
    } else if (normalizedDate1.getTime() > normalizedDate2.getTime()) {
      return "greater"; // date1 is after date2
    } else {
      return "less"; // date1 is before date2
    }
  };

  const convertUTCToLocalTime = (time: string): Date => {
    // Parse the UTC time string into a Date object
    const utcDate = new Date(time);
  
    // Check if the parsed date is valid
    if (isNaN(utcDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    // Convert the UTC date to local time
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60 * 1000);
  
    return localDate;
  };

  const isUnlockedLevel = (level: Level) => {
    const isAvailable = level.isAvailable;
    const isLevelCompleted = level.completedQuestions.length === level.questions.length;
    const isScheduledToday =  compareDates(new Date(), convertUTCToLocalTime(level.scheduledAt)) === "equal";
    console.log("isAvailable", isAvailable, "isLevelCompleted", isLevelCompleted, "isScheduledToday", isScheduledToday);
    return isAvailable && (isLevelCompleted || isScheduledToday);
  }

  // Fetch and update image URLs
  const getImageUrls = async () => {
    try {
      const markerElfUrl = await getPresignedUrl("marker-elf.png");
      const markerElfLockedUrl = await getPresignedUrl("marker-elf-locked.png");

      if (markerElfUrl && markerElfLockedUrl) {
        setMarkerElfImageUrl(markerElfUrl);
        setMarkerElfLockedImageUrl(markerElfLockedUrl);
        console.log("recieved new URLs");
      } else {
        console.warn("Failed to get one or more signed URLs.");
      }
    } catch (err) {
      console.error("Error fetching image URLs:", err);
    }
  };

  useEffect(() => {
    getImageUrls();
    const intervalId = setInterval(getImageUrls, 1 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Compute markers when levels or image URLs change
  const markersFromLevels = useMemo(() => {
    return levels.map((l) => ({
      lat: parseFloat(l.coordinates.latitude),
      lng: parseFloat(l.coordinates.longitude),
      label: `${l.name.en}`,
      imageUrl: levels.some((level) => level.id === l.id && isUnlockedLevel(level))
        ? markerElfImageUrl
        : markerElfLockedImageUrl,
      locked: !levels.some((level) => level.id === l.id && isUnlockedLevel(level)),
      id: l.id,
    }));
  }, [levels, markerElfImageUrl, markerElfLockedImageUrl]);

  // Update JSON whenever `markersFromLevels` changes
  useEffect(() => {
    setMarkersJson(JSON.stringify(markersFromLevels));
  }, [markersFromLevels]);

  useEffect(() => {
    if (level && webviewRef.current) {
      const selectedLevel = levels.find((l) => l.id === level.id);
      if (selectedLevel) {
        const latitude = parseFloat(selectedLevel.coordinates.latitude);
        const longitude = parseFloat(selectedLevel.coordinates.longitude);

        setTimeout(() => {
          webviewRef.current?.injectJavaScript(`
            let rotationAngle = 0;
            const targetLat = ${latitude};
            const targetLng = ${longitude};
            const interval = setInterval(() => {
              world.pointOfView({ lat: 0, lng: rotationAngle, altitude: 2 }, 100);
              rotationAngle += 5;
              if (rotationAngle >= 360) {
                clearInterval(interval);
                world.pointOfView({ lat: targetLat, lng: targetLng, altitude: 1.5 }, 2000);
              }
            }, 50);
          `);
        }, 2000);
      }
    }
  }, [level]);


  const htmlContent = `
    <html>
      <head>
        <script src="https://unpkg.com/globe.gl"></script>
        <style>
          body { margin: 0; overflow: hidden; }
          #globeViz { width: 100vw; height: 100vh; }
          .marker-img {
            width: 150px;
            height: 150px;
            position: absolute;
            transform: translate(-50%, -50%);
            pointer-events: auto;
          }
        </style>
      </head>
      <body>
        <div id="globeViz"></div>
        <script>
          const world = Globe()
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('#000')
            .pointOfView({ lat: 0, lng: 0, altitude: 2 })
            (document.getElementById('globeViz'));

          const markers = ${markersJson};

          world
            .htmlElementsData(markers)
            .htmlLat(d => d.lat)
            .htmlLng(d => d.lng)
            .htmlElement(d => {
              const el = document.createElement('div');
              el.innerHTML = '<img src="' + d.imageUrl + '" class="marker-img"/>';
              el.onclick = () => {
                if (d.locked) {
                  alert(d.label + ' is locked! Complete other levels to unlock.');
                } else {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'navigate', levelId: d.id }));
                }
              };
              return el;
            });

          window.addEventListener("message", function(event) {
            const message = JSON.parse(event.data);
            if (message.lat && message.lng) {
              world.pointOfView({ lat: message.lat, lng: message.lng, altitude: 1.5 }, 2000);
            }
          });
        </script>
      </body>
    </html>
  `;

  // Handle message from WebView
  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === "navigate") {
        const selectedLevel = levels.find((l) => l.id === message.levelId);
        if (selectedLevel) {
          navigation.navigate("Gameplay", { level: selectedLevel });
        }
      }
    } catch (error) {
      console.error("Error processing message from WebView:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ButtonsHeader
        imageSourceLeftButton={require("../../assets/images/icon-back.png")}
        onPressLeft={() => navigation.navigate("Calendar")}
        isLeftGradient={false}
      />
      <WebView
        ref={webviewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  webview: {
    flex: 1,
  },
});

