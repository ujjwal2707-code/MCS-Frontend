import {SafeAreaView, StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackBtn from './back-btn';

interface ScreenLayoutProps {
  children: ReactNode;
}

const ScreenLayout = ({children, style}: {children: React.ReactNode; style?: any}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={styles.gradientBackground}>
        {children}

        {/* <BackBtn /> */}
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
