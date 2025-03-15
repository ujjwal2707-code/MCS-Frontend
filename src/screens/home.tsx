import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Paths} from '../navigation/paths';
import {RootScreenProps} from '../navigation/types';

const Home = ({navigation}: RootScreenProps<Paths.Home>) => {
  
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="App Permission"
        onPress={() => navigation.navigate(Paths.AppPermission)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
