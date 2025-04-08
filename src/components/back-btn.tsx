import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const BackBtn = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backBtn}>
      <Ionicons name="arrow-back" size={25} color="black" />
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 999,
    backgroundColor: '#5DFFAE',
    padding: 10,
    borderRadius: 30,
  },
});
