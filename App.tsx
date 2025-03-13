import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1,padding:30}}>
      <Text style={styles.text}>Maha cyber safe</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    text:{
      fontSize:25,
      color:"red",
      fontWeight:"bold"
    }
});

export default App;
