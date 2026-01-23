/**
 * Task Card Component
 * 
 * Displays a task with mini stats and preview
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types/task';
import { calculateStats } from '@/utils/stats';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onLongPress?: () => void;
}

export function TaskCard({ task, onPress, onLongPress }: TaskCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const stats = useMemo(() => calculateStats(task), [task]);
  
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderColor: isDark ? '#2A2A2A' : '#D0D7DE',
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Color indicator */}
      <View style={[styles.colorBar, { backgroundColor: task.color }]} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#1F2328' }]}
            numberOfLines={1}
          >
            {task.name}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#8B949E' : '#57606A'}
          />
        </View>
        
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatBadge
            icon="flame"
            value={stats.currentStreak}
            label="streak"
            color={stats.currentStreak > 0 ? '#F97316' : (isDark ? '#8B949E' : '#57606A')}
            isDark={isDark}
          />
          <StatBadge
            icon="trophy"
            value={stats.longestStreak}
            label="best"
            color={isDark ? '#FBBF24' : '#CA8A04'}
            isDark={isDark}
          />
          <StatBadge
            icon="checkmark-circle"
            value={stats.totalCompletions}
            label="total"
            color={task.color}
            isDark={isDark}
          />
          <StatBadge
            icon="stats-chart"
            value={`${stats.completionRate}%`}
            label="rate"
            color={isDark ? '#8B949E' : '#57606A'}
            isDark={isDark}
          />
        </View>
        
        {/* Mini heatmap preview (last 7 days) */}
        <View style={styles.miniHeatmap}>
          {getLastNDays(7).map((date) => {
            const completed = task.completedDates.includes(date);
            return (
              <View
                key={date}
                style={[
                  styles.miniCell,
                  {
                    backgroundColor: completed
                      ? task.color
                      : isDark
                      ? '#21262D'
                      : '#EAEEF2',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}

interface StatBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
  isDark: boolean;
}

function StatBadge({ icon, value, label, color, isDark }: StatBadgeProps) {
  return (
    <View style={styles.statBadge}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.statValue, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#57606A' }]}>
        {label}
      </Text>
    </View>
  );
}

function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBadge: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  miniHeatmap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  miniCell: {
    width: 32,
    height: 8,
    borderRadius: 2,
  },
});
