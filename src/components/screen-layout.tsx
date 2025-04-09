import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenLayoutProps {
  children: ReactNode;
  style?: any;
}

const ScreenLayout = ({ children, style }: ScreenLayoutProps) => {
  return (
    <View style={styles.fullScreen}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={StyleSheet.absoluteFill}>
        {/* The gradient now covers the entire screen */}
      </LinearGradient>
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.innerContent}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  innerContent: {
    flex: 1,
    padding: 20, // Apply padding here instead of on the gradient
  },
});
