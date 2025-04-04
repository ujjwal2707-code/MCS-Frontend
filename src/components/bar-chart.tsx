// HorizontalBarsChart.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BarRow from './bar-row';
import CustomText from './ui/custom-text';

interface Stats {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

interface HorizontalBarsChartProps {
  stats: Stats;
}

const HorizontalBarsChart: React.FC<HorizontalBarsChartProps> = ({stats}) => {
  const data = [
    {label: 'Malicious', value: stats.malicious, color: '#FE3A39'}, // #FE3A39
    {label: 'Suspicious', value: stats.suspicious, color: '#FFE470'}, // #FFE470
    {label: 'Undetected', value: stats.undetected, color: '#FFA24D'}, // #FFA24D
    {label: 'Harmless', value: stats.harmless, color: '#5DFFAE'}, // #5DFFAE
  ];

  const maxValue = 100;

  return (
    <View style={styles.container}>
      {data.map(item => (
        <BarRow
          key={item.label}
          label={item.label}
          value={item.value}
          maxValue={maxValue}
          color={item.color}
        />
      ))}

      {/* Scale below the bars */}
      <View style={styles.scaleContainer}>
        {[0, 25, 50, 75, 100].map((val, idx) => (
          <CustomText
            fontFamily="Montserrat-Medium"
            key={idx}
            style={styles.scaleText}>
            {val}
          </CustomText>
        ))}
      </View>
    </View>
  );
};

export default HorizontalBarsChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 110,
  },
  scaleText: {
    color: '#999',
  },
});
