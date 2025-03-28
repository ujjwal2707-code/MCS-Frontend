import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface FeatureTileProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const FeatureTile = ({icon, label, onPress}: FeatureTileProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FeatureTile;

const styles = StyleSheet.create({
  container: {
    width: '30%',
    height: 112,
    padding: 8,
    marginTop:5,
    borderRadius: '100%',
    borderWidth: 1,
    backgroundColor: '#4E4E96',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
});
