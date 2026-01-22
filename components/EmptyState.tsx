/**
 * Empty State Component
 * 
 * Shown when user has no tasks
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ title, subtitle, icon = 'calendar-outline' }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? '#21262D' : '#F6F8FA' },
        ]}
      >
        <Ionicons
          name={icon}
          size={48}
          color={isDark ? '#8B949E' : '#57606A'}
        />
      </View>
      <Text style={[styles.title, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#8B949E' : '#57606A' }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
