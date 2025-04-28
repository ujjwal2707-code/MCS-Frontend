import React from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message';

type ToastPosition = 'top' | 'bottom';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#22c55e', backgroundColor: '#ecfdf5' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#166534',
      }}
      text2Style={{
        fontSize: 14,
        color: '#166534',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ef4444', backgroundColor: '#fef2f2' }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#991b1b',
      }}
      text2Style={{
        fontSize: 14,
        color: '#991b1b',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3b82f6', backgroundColor: '#eff6ff' }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
      }}
      text2Style={{
        fontSize: 14,
        color: '#1e40af',
      }}
    />
  ),
};

class CustomToast {
  static showSuccess(
    title: string,
    message?: string,
    position: ToastPosition = 'bottom',
    duration: number = 3000
  ) {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position,
      visibilityTime: duration,
      autoHide: true,
    });
  }

  static showError(
    title: string,
    message?: string,
    position: ToastPosition = 'bottom',
    duration: number = 5000
  ) {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position,
      visibilityTime: duration,
      autoHide: true,
    });
  }

  static showInfo(
    title: string,
    message?: string,
    position: ToastPosition = 'bottom',
    duration: number = 3000
  ) {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position,
      visibilityTime: duration,
      autoHide: true,
    });
  }

  static hide() {
    Toast.hide();
  }
}

export { Toast, CustomToast };
