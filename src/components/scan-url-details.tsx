import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Pressable,
  Linking,
  StyleSheet,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ScanWebResultProps {
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
  };
  url: string;
}
const ScanUrlDetails = ({stats, url}: ScanWebResultProps) => {
//   const chartConfig = {
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     strokeWidth: 2,
//     barPercentage: 0.5,
//   };

//   const data = {
//     labels: ['Malicious', 'Suspicious', 'Undetected', 'Harmless'],
//     datasets: [
//       {
//         data: [
//           stats.malicious,
//           stats.suspicious,
//           stats.undetected,
//           stats.harmless,
//         ],
//       },
//     ],
//   };

  const isSafe =
    stats.harmless + stats.undetected >=
    10 * (stats.malicious + stats.suspicious);
    
  return (
    <View style={styles.container}>
      {/* <View style={styles.chartContainer}>
        <View style={styles.chartContent}>
          <BarChart
            data={data}
            width={Dimensions.get('window').width * 0.9}
            height={300}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>
      </View> */}

      {isSafe ? (
        <View style={styles.safeContainer}>
          <Text style={styles.titleText}>Safe & Harmless Link</Text>
          <Text style={styles.descriptionText}>
            {stats.malicious} malicious threats were detected on this website.
            It is considered safe by most security checks.
          </Text>
        </View>
      ) : (
        <View style={styles.unsafeContainer}>
          <Text style={styles.titleText}>
            Suspected Fraud or Malicious Link
          </Text>
          <Text style={styles.descriptionText}>
            This website has been flagged as malicious or suspicious by multiple
            sources. Please proceed with caution.
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => Linking.openURL(url)}
        style={styles.pressableContainer}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Open Link</Text>
          <Ionicons
            name="arrow-redo-circle-sharp"
            size={30}
            color="blue"
            style={styles.iconStyle}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default ScanUrlDetails;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  chartContainer: {
    width: '100%',
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  safeContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4ade80', // Tailwind green-400
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unsafeContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f87171', // Tailwind red-400
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
  },
  pressableContainer: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 4,
    borderColor: '#1D4ED8', // Tailwind blue-700
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1D4ED8',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  iconStyle: {
    marginLeft: 2,
  },
});
