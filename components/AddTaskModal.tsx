/**
 * Add Task Modal Component
 * 
 * Simple modal for creating new tasks
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { TASK_COLORS } from '@/types/task';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
  existingTaskCount: number;
}

export function AddTaskModal({ visible, onClose, onAdd, existingTaskCount }: AddTaskModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [taskName, setTaskName] = useState('');
  const [selectedColor, setSelectedColor] = useState(
    TASK_COLORS[existingTaskCount % TASK_COLORS.length]
  );
  
  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd(taskName.trim(), selectedColor);
      setTaskName('');
      setSelectedColor(TASK_COLORS[(existingTaskCount + 1) % TASK_COLORS.length]);
    }
  };
  
  const handleClose = () => {
    setTaskName('');
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#000000' : '#FFFFFF',
              borderColor: isDark ? '#30363D' : '#D0D7DE',
            },
          ]}
        >
          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: isDark ? '#30363D' : '#D0D7DE' }]} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#F0F6FC' : '#1F2328' }]}>
              New Task
            </Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#8B949E' : '#57606A'} />
            </Pressable>
          </View>
          
          {/* Task name input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#8B949E' : '#57606A' }]}>
              Task Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#21262D' : '#F6F8FA',
                  color: isDark ? '#F0F6FC' : '#1F2328',
                  borderColor: isDark ? '#30363D' : '#D0D7DE',
                },
              ]}
              placeholder="e.g., Exercise, Read, Meditate..."
              placeholderTextColor={isDark ? '#484F58' : '#8C959F'}
              value={taskName}
              onChangeText={setTaskName}
              autoFocus
              maxLength={50}
            />
          </View>
          
          {/* Color selection */}
          <View style={styles.colorContainer}>
            <Text style={[styles.label, { color: isDark ? '#8B949E' : '#57606A' }]}>
              Color
            </Text>
            <View style={styles.colorGrid}>
              {TASK_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Add button */}
          <Pressable
            onPress={handleAdd}
            disabled={!taskName.trim()}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: selectedColor },
              !taskName.trim() && { opacity: 0.5 },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Create Task</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  colorContainer: {
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
