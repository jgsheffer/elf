import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select"
import { colors } from "../theme"
import LinearGradient from "react-native-linear-gradient"

interface DatePickerProps {
  onMonthChange?: (month: number | undefined) => void;
  onDayChange?: (day: number | undefined) => void;
  onYearChange?: (year: number | undefined) => void;
  defaultMonth?: number; // Default selected month
  defaultDay?: number;   // Default selected day
  defaultYear?: number;  // Default selected year
  yearsLength: number;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  onMonthChange,
  onDayChange,
  onYearChange,
  yearsLength = 100,
  defaultMonth,
  defaultDay,
  defaultYear,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    defaultMonth ? Number(defaultMonth) : undefined,
  )
  const [selectedDay, setSelectedDay] = useState<number | undefined>(
    defaultDay ? Number(defaultDay) : undefined,
  )
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    defaultYear ? Number(defaultYear) : undefined,
  )

  const months = [
    { label: "January", value: 1, abbreviation: "Jan" },
    { label: "February", value: 2, abbreviation: "Feb" },
    { label: "March", value: 3, abbreviation: "Mar" },
    { label: "April", value: 4, abbreviation: "Apr" },
    { label: "May", value: 5, abbreviation: "May" },
    { label: "June", value: 6, abbreviation: "Jun" },
    { label: "July", value: 7, abbreviation: "Jul" },
    { label: "August", value: 8, abbreviation: "Aug" },
    { label: "September", value: 9, abbreviation: "Sep" },
    { label: "October", value: 10, abbreviation: "Oct" },
    { label: "November", value: 11, abbreviation: "Nov" },
    { label: "December", value: 12, abbreviation: "Dec" },
  ];
  
  const days = () => {
    if(selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11)
    {
      return Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))
    }
    else if(selectedMonth === 2)
    {
      return Array.from({ length: (selectedYear && selectedYear % 4 == 0) ? 29 : 28 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))
    }
    else
    {
      return Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))
    }
  }

  const years = Array.from({ length: yearsLength }, (_, i) => ({
    label: `${2024 - i}`,
    value: 2024 - i,
  }))

  const handleMonthChange = (month: number | undefined) => {
    setSelectedMonth(month);
    if (onMonthChange)
      onMonthChange(month);
  };

  const handleDayChange = (day: number | undefined) => {
    setSelectedDay(day);
    if (onDayChange)
      onDayChange(day);
  };

  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
    if (onYearChange)
      onYearChange(year);
  };

return (
  <View style={styles.container}>
    <View style={[styles.dateContainer, {flexDirection: Platform.OS === "ios" ? "row" : "column", width: Platform.OS === "ios" ? "34%" : "100%"}]}>
      <LinearGradient colors={["#A4D1E7", "#FDFFFF"]} style={styles.outerGradient}>
        <LinearGradient colors={["#FFFFFF", "#D2EBF5"]} style={styles.innerGradient}>
          <RNPickerSelect
            value={selectedMonth} 
            onValueChange={(value) => handleMonthChange(value)}
            items={months.map((month) => ({
              label: month.abbreviation,
              value: month.value,
            }))}
            placeholder={{ label: "Month", value: null }}
            style={pickerSelectStyles}
          />
        </LinearGradient>

      </LinearGradient>

      <LinearGradient colors={["#A4D1E7", "#FDFFFF"]} style={styles.outerGradient}>
        <LinearGradient colors={["#FFFFFF", "#D2EBF5"]} style={styles.innerGradient}>
          <RNPickerSelect
            value={selectedDay}
            onValueChange={(value) => handleDayChange(value)}
            items={days()}
            placeholder={{ label: "Day", value: null }}
            style={pickerSelectStyles}
          />
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#A4D1E7", "#FDFFFF"]} style={styles.outerGradient}>
        <LinearGradient colors={["#FFFFFF", "#D2EBF5"]} style={styles.innerGradient}>
          <RNPickerSelect
            value={selectedYear}
            onValueChange={(value) => handleYearChange(value)}
            items={years}
            placeholder={{ label: "Year", value: null }}
            style={pickerSelectStyles}
          />
        </LinearGradient>
      </LinearGradient>
    </View>
  </View>
)}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dateContainer: {
    justifyContent: "space-between",
    marginBottom: 0,
  },
  outerGradient: {
    width: "100%",
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  innerGradient: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: colors.palette.black,
    borderRadius: 10,
    textAlign: "center",
    color: colors.palette.black,
  },
  inputAndroid: {
    textAlign: "center",
  },
})
