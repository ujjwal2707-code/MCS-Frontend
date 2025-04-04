// BarRow.tsx
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import CustomText from './ui/custom-text';

interface BarRowProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const BarRow: React.FC<BarRowProps> = ({label, value, maxValue, color}) => {
  const containerWidth = Dimensions.get('window').width - 200;
  const numericBarWidth = (value / maxValue) * containerWidth;

  return (
    <View style={styles.row}>
      <CustomText fontFamily='Montserrat-Bold' style={styles.label}>{label}</CustomText>

      <View style={styles.barContainer}>
        <View style={styles.dottedLine} />

        <View
          style={[styles.bar, {width: numericBarWidth, backgroundColor: color}]}
        />
      </View>
    </View>
  );
};

export default BarRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // space between rows
  },
  label: {
    width: 100,
  },
  barContainer: {
    flex: 1,
    marginLeft: 10,
    height: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  dottedLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 1,
  },
  bar: {
    height: 10,
    borderRadius: 5,
  },
});
