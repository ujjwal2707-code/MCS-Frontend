import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import ScreenLayout from './screen-layout';

const FullScreenLoader = () => {
  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </ScreenLayout>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
