/**
 * Task Dashboard Screen
 * 
 * Main screen showing all tasks in a list/grid view
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import { EmptyState } from '@/components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const { tasks, loading, addTask, deleteTask, refreshTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleAddTask = async (name: string, color: string) => {
    await addTask(name);
    setModalVisible(false);
  };
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };
  
  const handleTaskLongPress = (taskId: string, taskName: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F6F8FA' }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: isDark ? '#8B949E' : '#57606A' }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.title, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
            Streakly
          </Text>
        </View>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: isDark ? '#238636' : '#1F883D' },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      
      {/* Task count */}
      {tasks.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: isDark ? '#8B949E' : '#57606A' }]}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
      )}
      
      {/* Task list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: isDark ? '#8B949E' : '#57606A' }]}>
            Loading tasks...
          </Text>
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          subtitle="Create your first task to start tracking your daily progress and building streaks!"
          icon="rocket-outline"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? '#8B949E' : '#57606A'}
            />
          }
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
              onLongPress={() => handleTaskLongPress(task.id, task.name)}
            />
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
      
      {/* Add Task Modal */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTask}
        existingTaskCount={tasks.length}
      />
      
      {/* Floating action button (alternative) */}
      {tasks.length > 0 && (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: isDark ? '#238636' : '#1F883D' },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
