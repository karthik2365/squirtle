/**
 * Task Detail Screen
 * 
 * Shows task calendar, heatmap, and statistics
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTasks } from '@/context/TaskContext';
import { Heatmap } from '@/components/Heatmap';
import { CalendarView } from '@/components/CalendarView';
import { StatsCard } from '@/components/StatsCard';
import { calculateStats } from '@/utils/stats';
import { getToday, isToday, isFuture } from '@/utils/date';
import { confirmAction } from '@/utils/confirm';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { getTask, toggleCompletion, deleteTask } = useTasks();
  const task = getTask(id);
  
  const stats = useMemo(() => {
    if (!task) return null;
    return calculateStats(task);
  }, [task]);
  
  if (!task || !stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F6F8FA' }]}
      >
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
            Task not found
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: isDark ? '#58A6FF' : '#0969DA' }]}>
              Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleDayPress = async (date: string) => {
    if (isFuture(date)) return;
    await toggleCompletion(task.id, date);
  };
  
  const handleDelete = () => {
    confirmAction({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.name}"? All progress will be lost.`,
      confirmText: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deleteTask(task.id);
        router.back();
      },
    });
  };
  
  const todayCompleted = task.completedDates.includes(getToday());
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F6F8FA' }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? '#F0F6FC' : '#1F2328'}
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <View style={[styles.colorDot, { backgroundColor: task.color }]} />
          <Text
            style={[styles.title, { color: isDark ? '#F0F6FC' : '#1F2328' }]}
            numberOfLines={1}
          >
            {task.name}
          </Text>
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons
            name="trash-outline"
            size={22}
            color={isDark ? '#F85149' : '#CF222E'}
          />
        </Pressable>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's status */}
        <Pressable
          onPress={() => handleDayPress(getToday())}
          style={({ pressed }) => [
            styles.todayCard,
            {
              backgroundColor: todayCompleted
                ? task.color
                : isDark
                ? '#161B22'
                : '#FFFFFF',
              borderColor: todayCompleted
                ? task.color
                : isDark
                ? '#30363D'
                : '#D0D7DE',
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={styles.todayContent}>
            <View>
              <Text
                style={[
                  styles.todayLabel,
                  { color: todayCompleted ? 'rgba(255,255,255,0.8)' : isDark ? '#8B949E' : '#57606A' },
                ]}
              >
                Today
              </Text>
              <Text
                style={[
                  styles.todayStatus,
                  { color: todayCompleted ? '#FFFFFF' : isDark ? '#F0F6FC' : '#1F2328' },
                ]}
              >
                {todayCompleted ? 'Completed!' : 'Not completed'}
              </Text>
            </View>
            <View
              style={[
                styles.todayCheckbox,
                {
                  backgroundColor: todayCompleted
                    ? 'rgba(255,255,255,0.2)'
                    : isDark
                    ? '#21262D'
                    : '#F6F8FA',
                  borderColor: todayCompleted
                    ? 'rgba(255,255,255,0.3)'
                    : isDark
                    ? '#30363D'
                    : '#D0D7DE',
                },
              ]}
            >
              {todayCompleted ? (
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="add"
                  size={24}
                  color={isDark ? '#8B949E' : '#57606A'}
                />
              )}
            </View>
          </View>
          
          {/* Streak indicator */}
          {stats.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons
                name="flame"
                size={16}
                color={todayCompleted ? '#FFFFFF' : '#F97316'}
              />
              <Text
                style={[
                  styles.streakText,
                  { color: todayCompleted ? '#FFFFFF' : '#F97316' },
                ]}
              >
                {stats.currentStreak} day streak!
              </Text>
            </View>
          )}
        </Pressable>
        
        {/* GitHub-style Heatmap */}
        <View
          style={[
            styles.heatmapCard,
            {
              backgroundColor: isDark ? '#161B22' : '#FFFFFF',
              borderColor: isDark ? '#30363D' : '#D0D7DE',
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
            Activity
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#8B949E' : '#57606A' }]}>
            {stats.yearlyCompletions} completions in the last year
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Heatmap
              completedDates={task.completedDates}
              taskColor={task.color}
              onDayPress={handleDayPress}
            />
          </ScrollView>
        </View>
        
        {/* Statistics */}
        <StatsCard stats={stats} taskColor={task.color} />
        
        {/* Monthly Calendar */}
        <CalendarView
          completedDates={task.completedDates}
          taskColor={task.color}
          onDayPress={handleDayPress}
        />
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  backLink: {
    fontSize: 16,
  },
  todayCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayLabel: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayStatus: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  todayCheckbox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heatmapCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  bottomPadding: {
    height: 40,
  },
});
