/**
 * Stats Card Component
 * 
 * Displays detailed statistics for a task
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TaskStats } from '@/types/task';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
  stats: TaskStats;
  taskColor: string;
}

export function StatsCard({ stats, taskColor }: StatsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
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
      <Text style={[styles.title, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
        Statistics
      </Text>
      
      <View style={styles.grid}>
        <StatItem
          icon="flame"
          value={stats.currentStreak}
          label="Current Streak"
          suffix="days"
          color="#F97316"
          isDark={isDark}
          highlight={stats.currentStreak > 0}
        />
        <StatItem
          icon="trophy"
          value={stats.longestStreak}
          label="Longest Streak"
          suffix="days"
          color="#FBBF24"
          isDark={isDark}
        />
        <StatItem
          icon="checkmark-done"
          value={stats.totalCompletions}
          label="Total Completions"
          suffix=""
          color={taskColor}
          isDark={isDark}
        />
        <StatItem
          icon="pie-chart"
          value={stats.completionRate}
          label="Completion Rate"
          suffix="%"
          color="#8B5CF6"
          isDark={isDark}
        />
        <StatItem
          icon="calendar"
          value={stats.monthlyCompletions}
          label="This Month"
          suffix="days"
          color="#3B82F6"
          isDark={isDark}
        />
        <StatItem
          icon="calendar-outline"
          value={stats.yearlyCompletions}
          label="This Year"
          suffix="days"
          color="#10B981"
          isDark={isDark}
        />
      </View>
    </View>
  );
}

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  suffix: string;
  color: string;
  isDark: boolean;
  highlight?: boolean;
}

function StatItem({ icon, value, label, suffix, color, isDark, highlight }: StatItemProps) {
  return (
    <View
      style={[
        styles.statItem,
        {
          backgroundColor: isDark ? '#21262D' : '#F6F8FA',
          borderColor: highlight ? color : 'transparent',
          borderWidth: highlight ? 1 : 0,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
          {value}
          {suffix && <Text style={styles.statSuffix}>{suffix}</Text>}
        </Text>
        <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#57606A' }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statSuffix: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 2,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
