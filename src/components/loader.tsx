import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

export default Loader;
