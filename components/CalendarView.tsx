/**
 * Calendar View Component
 * 
 * Compact monthly calendar for marking task completion
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMonthGrid, formatDate, isFuture, isToday, getToday } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';

interface CalendarViewProps {
  completedDates: string[];
  taskColor: string;
  onDayPress: (date: string) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarView({ completedDates, taskColor, onDayPress }: CalendarViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const grid = useMemo(
    () => getMonthGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );
  
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);
  
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });
  
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#161B22' : '#FFFFFF',
          borderColor: isDark ? '#30363D' : '#D0D7DE',
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goToPrevMonth} style={styles.navButton}>
          <Ionicons
            name="chevron-back"
            size={18}
            color={isDark ? '#8B949E' : '#57606A'}
          />
        </Pressable>
        
        <Pressable onPress={goToToday}>
          <Text style={[styles.monthTitle, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
            {monthName}
          </Text>
        </Pressable>
        
        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isDark ? '#8B949E' : '#57606A'}
          />
        </Pressable>
      </View>
      
      {/* Weekday labels */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            style={[styles.weekdayLabel, { color: isDark ? '#8B949E' : '#57606A' }]}
          >
            {day}
          </Text>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.grid}>
        {grid.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }
          
          const completed = completedSet.has(date);
          const future = isFuture(date);
          const todayDate = isToday(date);
          const dayNumber = parseInt(date.split('-')[2], 10);
          
          return (
            <Pressable
              key={date}
              onPress={() => !future && onDayPress(date)}
              disabled={future}
              style={({ pressed }) => [
                styles.dayCell,
                pressed && !future && { opacity: 0.7 },
              ]}
            >
              <View
                style={[
                  styles.dayContent,
                  completed && { backgroundColor: taskColor },
                  todayDate && !completed && { 
                    borderWidth: 1.5, 
                    borderColor: taskColor 
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: completed
                        ? '#FFFFFF'
                        : future
                        ? isDark
                          ? '#484F58'
                          : '#B1BAC4'
                        : isDark
                        ? '#F0F6FC'
                        : '#1F2328',
                      fontWeight: todayDate ? '700' : '500',
                    },
                  ]}
                >
                  {dayNumber}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navButton: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 1,
  },
  dayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
