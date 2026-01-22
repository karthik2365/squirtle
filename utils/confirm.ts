/**
 * Cross-platform confirmation dialog
 * Works on mobile (native Alert) and web (window.confirm)
 */

import { Alert, Platform } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function confirmAction({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmOptions): void {
  if (Platform.OS === 'web') {
    // Use browser's confirm dialog for web
    const result = window.confirm(`${title}\n\n${message}`);
    if (result) {
      onConfirm();
    } else {
      onCancel?.();
    }
  } else {
    // Use native Alert for mobile
    Alert.alert(title, message, [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ]);
  }
}
