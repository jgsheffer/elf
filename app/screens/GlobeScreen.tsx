import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { View, StyleSheet, Image, Animated, Dimensions, Platform } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { useNavigation } from "@react-navigation/native"
import { ButtonsHeader } from "app/components/ButtonsHeader"
import { AuthContext } from "app/contexts/AuthContext"
import { Level } from "../apiResponseTypes/levelType";

const countryMarkers = [
  {
    country: "Canada",
    capitalName: "Ottawa",
    center: { latitude: 56.1304, longitude: -106.3468 },
    capital: { latitude: 45.4215, longitude: -75.6972 },
    markerImage: require("../../assets/icons/markers/marker-canada.png"),
    locked: true,
  },
  {
    country: "Australia",
    capitalName: "Canberra",
    center: { latitude: -25.2744, longitude: 133.7751 },
    capital: { latitude: -35.2809, longitude: 149.13 },
    markerImage: require("../../assets/icons/markers/marker-australia.png"),
    locked: true,
  },
  {
    country: "Mexico",
    capitalName: "Mexico City",
    center: { latitude: 23.6345, longitude: -102.5528 },
    capital: { latitude: 19.4326, longitude: -99.1332 },
    markerImage: require("../../assets/icons/markers/marker-mexico.png"),
    locked: true,
  },
  {
    country: "Algeria",
    capitalName: "Algiers",
    center: { latitude: 28.0, longitude: 3.0 },
    capital: { latitude: 36.75, longitude: 3.04 },
    markerImage: require("../../assets/icons/markers/marker-algeria.png"),
    locked: true,
  },
  {
    country: "Andorra",
    capitalName: "Andorra la Vella",
    center: { latitude: 42.5, longitude: 1.5 },
    capital: { latitude: 42.5078, longitude: 1.5211 },
    markerImage: require("../../assets/icons/markers/marker-andorra.png"),
    locked: true,
  },
  {
    country: "Azerbaijan",
    capitalName: "Baku",
    center: { latitude: 40.5, longitude: 47.5 },
    capital: { latitude: 40.4093, longitude: 49.8671 },
    markerImage: require("../../assets/icons/markers/marker-azerbaijan.png"),
    locked: true,
  },
  {
    country: "Brunei",
    capitalName: "Bandar Seri Begawan",
    center: { latitude: 4.5, longitude: 114.5 },
    capital: { latitude: 4.9031, longitude: 114.9398 },
    markerImage: require("../../assets/icons/markers/marker-brunei.png"),
    locked: true,
  },
  {
    country: "Central African Republic",
    capitalName: "Bangui",
    center: { latitude: 6.0, longitude: 21.0 },
    capital: { latitude: 4.3947, longitude: 18.5582 },
    markerImage: require("../../assets/icons/markers/marker-central-african-republic.png"),
    locked: true,
  },
  {
    country: "China",
    capitalName: "Beijing",
    center: { latitude: 35.8617, longitude: 104.1954 },
    capital: { latitude: 39.9042, longitude: 116.4074 },
    markerImage: require("../../assets/icons/markers/marker-china.png"),
    locked: true,
  },
  {
    country: "Belize",
    capitalName: "Belmopan",
    center: { latitude: 17.1899, longitude: -88.4976 },
    capital: { latitude: 17.25, longitude: -88.7675 },
    markerImage: require("../../assets/icons/markers/marker-belize.png"),
    locked: true,
  },
  {
    country: "Switzerland",
    capitalName: "Bern",
    center: { latitude: 46.8182, longitude: 8.2275 },
    capital: { latitude: 46.9481, longitude: 7.4474 },
    markerImage: require("../../assets/icons/markers/marker-switzerland.png"),
    locked: true,
  },
  {
    country: "Colombia",
    capitalName: "Bogotá",
    center: { latitude: 4.5709, longitude: -74.2973 },
    capital: { latitude: 4.711, longitude: -74.0721 },
    markerImage: require("../../assets/icons/markers/marker-colombia.png"),
    locked: true,
  },
  {
    country: "Brazil",
    capitalName: "Brasilia",
    center: { latitude: -14.235, longitude: -51.9253 },
    capital: { latitude: -15.7939, longitude: -47.8828 },
    markerImage: require("../../assets/icons/markers/marker-brazil.png"),
    locked: true,
  },
  {
    country: "Republic of the Congo",
    capitalName: "Brazzaville",
    center: { latitude: -0.228, longitude: 15.8277 },
    capital: { latitude: -4.2634, longitude: 15.2429 },
    markerImage: require("../../assets/icons/markers/marker-congo.png"),
    locked: true,
  },
  {
    country: "Belgium",
    capitalName: "Brussels",
    center: { latitude: 50.5039, longitude: 4.4699 },
    capital: { latitude: 50.8503, longitude: 4.3517 },
    markerImage: require("../../assets/icons/markers/marker-belgium.png"),
    locked: true,
  },
  {
    country: "Argentina",
    capitalName: "Buenos Aires",
    center: { latitude: -38.4161, longitude: -63.6167 },
    capital: { latitude: -34.6037, longitude: -58.3816 },
    markerImage: require("../../assets/icons/markers/marker-argentina.png"),
    locked: true,
  },
  {
    country: "Burundi",
    capitalName: "Bujumbura",
    center: { latitude: -3.5, longitude: 30.0 },
    capital: { latitude: -3.3822, longitude: 29.3618 },
    markerImage: require("../../assets/icons/markers/marker-burundi.png"),
    locked: true,
  },

  {
    country: "Venezuela",
    capitalName: "Caracas",
    center: { latitude: 6.4238, longitude: -66.5897 },
    capital: { latitude: 10.4806, longitude: -66.9036 },
    markerImage: require("../../assets/icons/markers/marker-venezuela.png"),
    locked: true,
  },
  {
    country: "Botswana",
    capitalName: "Gaborone",
    center: { latitude: -22.0, longitude: 24.0 },
    capital: { latitude: -24.6282, longitude: 25.9231 },
    markerImage: require("../../assets/icons/markers/marker-botswana.png"),
    locked: true,
  },
  {
    country: "Vietnam",
    capitalName: "Hanoi",
    center: { latitude: 14.0583, longitude: 108.2772 },
    capital: { latitude: 21.0285, longitude: 105.8542 },
    markerImage: require("../../assets/icons/markers/marker-vietnam.png"),
    locked: true,
  },
  {
    country: "Zimbabwe",
    capitalName: "Harare",
    center: { latitude: -19.0154, longitude: 29.1549 },
    capital: { latitude: -17.8252, longitude: 31.0335 },
    markerImage: require("../../assets/icons/markers/marker-zimbabwe.png"),
    locked: true,
  },
  {
    country: "Cuba",
    capitalName: "Havana",
    center: { latitude: 21.5218, longitude: -77.7812 },
    capital: { latitude: 23.1136, longitude: -82.3666 },
    markerImage: require("../../assets/icons/markers/marker-cuba.png"),
    locked: true,
  },
  {
    country: "DR Congo",
    capitalName: "Kinshasa",
    center: { latitude: -2.5, longitude: 23.5 },
    capital: { latitude: -4.4419, longitude: 15.2663 },
    markerImage: require("../../assets/icons/markers/marker-dr-congo.png"),
    locked: true,
  },
  {
    country: "Peru",
    capitalName: "Lima",
    center: { latitude: -10.0, longitude: -75.25 },
    capital: { latitude: -12.0464, longitude: -77.0428 },
    markerImage: require("../../assets/icons/markers/marker-peru.png"),
    locked: true,
  },
  {
    country: "Angola",
    capitalName: "Luanda",
    center: { latitude: -12.5, longitude: 18.5 },
    capital: { latitude: -8.839, longitude: 13.2894 },
    markerImage: require("../../assets/icons/markers/marker-angola.png"),
    locked: true,
  },
  {
    country: "Zambia",
    capitalName: "Lusaka",
    center: { latitude: -15.4167, longitude: 28.2833 },
    capital: { latitude: -15.3875, longitude: 28.3228 },
    markerImage: require("../../assets/icons/markers/marker-zambia.png"),
    locked: true,
  },
  {
    country: "Bahrain",
    capitalName: "Manama",
    center: { latitude: 26.0667, longitude: 50.5577 },
    capital: { latitude: 26.2154, longitude: 50.5832 },
    markerImage: require("../../assets/icons/markers/marker-bahrain.png"),
    locked: true,
  },

  {
    country: "Uruguay",
    capitalName: "Montevideo",
    center: { latitude: -32.5228, longitude: -55.7658 },
    capital: { latitude: -34.9011, longitude: -56.1645 },
    markerImage: require("../../assets/icons/markers/marker-uruguay.png"),
    locked: true,
  },
  {
    country: "Chad",
    capitalName: "N'Djamena",
    center: { latitude: 15.4542, longitude: 18.7322 },
    capital: { latitude: 12.1348, longitude: 15.0557 },
    markerImage: require("../../assets/icons/markers/marker-chad.png"),
    locked: true,
  },
  {
    country: "Bahamas",
    capitalName: "Nassau",
    center: { latitude: 25.0343, longitude: -77.3963 },
    capital: { latitude: 25.0343, longitude: -77.3963 },
    markerImage: require("../../assets/icons/markers/marker-bahamas.png"),
    locked: true,
  },

  {
    country: "Burkina Faso",
    capitalName: "Ouagadougou",
    center: { latitude: 12.2383, longitude: -1.5616 },
    capital: { latitude: 12.3714, longitude: -1.5197 },
    markerImage: require("../../assets/icons/markers/marker-burkina-faso.png"),
    locked: true,
  },
  {
    country: "France",
    capitalName: "Paris",
    center: { latitude: 46.6034, longitude: 1.8883 },
    capital: { latitude: 48.8566, longitude: 2.3522 },
    markerImage: require("../../assets/icons/markers/marker-france.png"),
    locked: true,
  },
  {
    country: "Cambodia",
    capitalName: "Phnom Penh",
    center: { latitude: 12.5657, longitude: 104.991 },
    capital: { latitude: 11.5564, longitude: 104.9282 },
    markerImage: require("../../assets/icons/markers/marker-cambodia.png"),
    locked: true,
  },
  {
    country: "Benin",
    capitalName: "Porto-Novo",
    center: { latitude: 9.3077, longitude: 2.3158 },
    capital: { latitude: 6.4969, longitude: 2.6289 },
    markerImage: require("../../assets/icons/markers/marker-benin.png"),
    locked: true,
  },
  {
    country: "Czech Republic",
    capitalName: "Prague",
    center: { latitude: 49.8175, longitude: 15.473 },
    capital: { latitude: 50.0755, longitude: 14.4378 },
    markerImage: require("../../assets/icons/markers/marker-czech-republic.png"),
    locked: true,
  },
  {
    country: "Costa Rica",
    capitalName: "San José",
    center: { latitude: 9.7489, longitude: -83.7534 },
    capital: { latitude: 9.9281, longitude: -84.0907 },
    markerImage: require("../../assets/icons/markers/marker-costa-rica.png"),
    locked: true,
  },
  {
    country: "Yemen",
    capitalName: "Sana'a",
    center: { latitude: 15.5527, longitude: 48.5164 },
    capital: { latitude: 15.3694, longitude: 44.191 },
    markerImage: require("../../assets/icons/markers/marker-yemen.png"),
    locked: true,
  },
  {
    country: "Chile",
    capitalName: "Santiago",
    center: { latitude: -35.6751, longitude: -71.543 },
    capital: { latitude: -33.4489, longitude: -70.6693 },
    markerImage: require("../../assets/icons/markers/marker-chile.png"),
    locked: true,
  },
  {
    country: "Bolivia",
    capitalName: "Sucre/La Paz",
    center: { latitude: -16.2902, longitude: -63.5887 },
    capital: { latitude: -16.5, longitude: -68.15 },
    markerImage: require("../../assets/icons/markers/marker-bolivia.png"),
    locked: true,
  },
]

export const GlobeScreen = ({ route }) => {
  const mapRef = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(10)
  const { height } = Dimensions.get("window")
  const [elfiePosition] = useState(new Animated.Value(-50))
  const navigation = useNavigation()
  const { level } = route.params;
  const selectedLevel : Level = level as Level;
  const { user, levels = [] } = useContext(AuthContext) || {}

  useEffect(() => {
    rotateGlobe();
  }, [])

  const rotateGlobe = () => {
    const countryMarker = countryMarkers.find(
      (marker) => marker.country === selectedLevel.country.name.en,
    )

    let currentLongitude = -122.4324
    let rotationDegrees = 0

    const interval = setInterval(() => {
      currentLongitude += 5
      rotationDegrees += 5

      if (currentLongitude > 180) {
        currentLongitude = -180 + (currentLongitude - 180)
      }

      if (mapRef.current) {
        mapRef.current.animateCamera(
          {
            center: { latitude: 37.78825, longitude: currentLongitude },
            zoom: 2,
          },
          { duration: 50 },
        )
      }

      if (rotationDegrees >= 360) {
        clearInterval(interval)
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: countryMarker.capital.latitude,
              longitude: countryMarker?.capital.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            },
            4000,
          )
        }
      }
    }, 50)
  }

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
  const markers = countryMarkers.map((marker) => {
    const isUnlocked = levels.some((level, index) => ( level.country.name.en === marker.country && isUnlockedLevel(level) ))
    return { ...marker, locked: !isUnlocked }
  })

  console.log("markers", markers)

  return (
    <View style={styles.container}>
      <ButtonsHeader
        imageSourceLeftButton={require("../../assets/images/icon-back.png")}
        onPressLeft={() => navigation.goBack()}
        isLeftGradient={false}
      />
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType={Platform.OS == "android" ? "hybrid" : "hybridFlyover"}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
        onRegionChangeComplete={(region) => {
          const newZoomLevel = Math.round(Math.log2(360 / region.latitudeDelta))
          setZoomLevel(newZoomLevel)
        }}
      >
        {countryMarkers.map((marker) => (
          <Marker key={`${marker.country}-center`} coordinate={marker.center}>
            <Image source={marker.markerImage} style={styles.marker} />
          </Marker>
        ))}

        {markers.map((marker) => (
          <Marker
            key={`${marker.country}-capital`}
            coordinate={marker.capital}
            onPress={() => {
              if (marker.locked) {
                alert(`${marker.capitalName} is locked! Complete other levels to unlock this city.`)
              } else {
                navigation.navigate("Gameplay", { level:selectedLevel })
              }
            }}
          >
            <Image
              source={
                marker.locked
                  ? require("../../assets/icons/markers/marker-elf-locked-ios.png")
                  : require("../../assets/icons/markers/marker-elf-ios.png")
              }
              style={styles.marker}
            />
          </Marker>
        ))}
      </MapView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.elfieCorner,
          {
            transform: [{ translateY: elfiePosition }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    width: 40,
    height: 40,
  },
  elfieCorner: {
    bottom: "-20%",
    left: "-15%",
    position: "absolute",
  },
})
