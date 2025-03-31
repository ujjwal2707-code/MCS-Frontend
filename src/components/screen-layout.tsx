import {SafeAreaView, StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenLayoutProps {
  children: ReactNode;
}

const ScreenLayout = ({children}: ScreenLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={styles.gradientBackground}>
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradientBackground: {
    flex: 1,
    padding:20
  },
});
