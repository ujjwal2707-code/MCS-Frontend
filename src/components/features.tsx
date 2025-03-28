import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Features = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}></ScrollView>
  );
};

export default Features;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
});
