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
    margin: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#374151',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
});
