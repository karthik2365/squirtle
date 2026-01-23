/**
 * GitHub-style Contribution Heatmap Component
 * 
 * Displays a year-long heatmap of task completions
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HEATMAP_COLORS, HEATMAP_COLORS_LIGHT } from '@/types/task';
import { getYearHeatmapData, isFuture, isToday } from '@/utils/date';
import { calculateIntensity } from '@/utils/stats';

interface HeatmapProps {
  completedDates: string[];
  taskColor?: string;
  onDayPress?: (date: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = 11;
const CELL_GAP = 3;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function Heatmap({ completedDates, taskColor, onDayPress }: HeatmapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const heatmapData = useMemo(() => getYearHeatmapData(), []);
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);
  
  const getColor = (date: string): string => {
    if (isFuture(date)) {
      return isDark ? '#21262D' : '#EAEEF2';
    }
    
    if (!completedSet.has(date)) {
      return isDark ? '#21262D' : '#EAEEF2';
    }
    
    const intensity = calculateIntensity(date, completedDates);
    
    // Use task color if provided, otherwise use default green
    if (taskColor) {
      const opacity = [0.2, 0.35, 0.55, 0.75, 1][intensity];
      return adjustColorOpacity(taskColor, opacity);
    }
    
    const colors = isDark ? HEATMAP_COLORS : HEATMAP_COLORS_LIGHT;
    const levels = [colors.level0, colors.level1, colors.level2, colors.level3, colors.level4];
    return levels[intensity];
  };
  
  return (
    <View style={styles.container}>
      {/* Month labels - positioned based on week index */}
      <View style={styles.monthLabelsContainer}>
        <View style={{ width: 32 }} />
        <View style={styles.monthLabelsRow}>
          {heatmapData.months.map((month, index) => {
            const nextMonth = heatmapData.months[index + 1];
            const weeksSpan = nextMonth 
              ? nextMonth.startWeek - month.startWeek 
              : heatmapData.weeks.length - month.startWeek;
            
            // Only show label if there's enough space (at least 3 weeks)
            if (weeksSpan < 3) return null;
            
            return (
              <Text
                key={`${month.name}-${index}`}
                style={[
                  styles.monthLabel,
                  { 
                    width: weeksSpan * (CELL_SIZE + CELL_GAP),
                    color: isDark ? '#8B949E' : '#57606A',
                  },
                ]}
              >
                {month.name}
              </Text>
            );
          })}
        </View>
      </View>
      
      {/* Heatmap grid */}
      <View style={styles.gridContainer}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAY_LABELS.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.dayLabel,
                { color: isDark ? '#8B949E' : '#57606A' },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
        
        {/* Weeks */}
        <View style={styles.weeksContainer}>
          {heatmapData.weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((date, dayIndex) => (
                <Pressable
                  key={date}
                  onPress={() => !isFuture(date) && onDayPress?.(date)}
                  style={({ pressed }) => [
                    styles.cell,
                    {
                      backgroundColor: getColor(date),
                      opacity: pressed && !isFuture(date) ? 0.7 : 1,
                      borderWidth: isToday(date) ? 2 : 0,
                      borderColor: isDark ? '#58A6FF' : '#0969DA',
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: isDark ? '#8B949E' : '#57606A' }]}>
          Less
        </Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.legendCell,
              {
                backgroundColor: taskColor
                  ? adjustColorOpacity(taskColor, [0.15, 0.35, 0.55, 0.75, 1][level])
                  : isDark
                  ? [HEATMAP_COLORS.level0, HEATMAP_COLORS.level1, HEATMAP_COLORS.level2, HEATMAP_COLORS.level3, HEATMAP_COLORS.level4][level]
                  : [HEATMAP_COLORS_LIGHT.level0, HEATMAP_COLORS_LIGHT.level1, HEATMAP_COLORS_LIGHT.level2, HEATMAP_COLORS_LIGHT.level3, HEATMAP_COLORS_LIGHT.level4][level],
              },
            ]}
          />
        ))}
        <Text style={[styles.legendText, { color: isDark ? '#8B949E' : '#57606A' }]}>
          More
        </Text>
      </View>
    </View>
  );
}

function adjustColorOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  monthLabelsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  monthLabelsRow: {
    flexDirection: 'row',
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    width: 28,
    marginRight: 4,
    justifyContent: 'space-around',
  },
  dayLabel: {
    fontSize: 9,
    height: CELL_SIZE + CELL_GAP,
    lineHeight: CELL_SIZE + CELL_GAP,
  },
  weeksContainer: {
    flexDirection: 'row',
  },
  week: {
    flexDirection: 'column',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
    margin: CELL_GAP / 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 4,
  },
  legendText: {
    fontSize: 11,
    marginHorizontal: 6,
  },
  legendCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});
