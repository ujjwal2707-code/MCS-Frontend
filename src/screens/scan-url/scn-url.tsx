import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FeatureTileType} from '../../../types/types';
import {Paths} from '../../navigation/paths';
import {RootScreenProps} from '../../navigation/types';

const ScanUrl = ({navigation}: RootScreenProps<Paths.ScanUrl>) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
        paddingVertical: 5,
      }}>
      <FlatList
        data={featureTiles}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate(item.route)}>
            {item.icon}
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default ScanUrl;

const featureTiles: FeatureTileType[] = [
  {
    id: '1',
    icon: <MaterialCommunityIcons name="web-check" size={24} color="black" />,
    label: 'App URL',
    route: Paths.ScanAppUrl,
  },
  {
    id: '2',
    icon: <Ionicons name="globe-outline" size={24} color="black" />,
    label: 'Website URL',
    route: Paths.ScanWebUrl,
  },
  {
    id: '3',
    icon: <Ionicons name="globe-outline" size={24} color="black" />,
    label: 'Payment URL',
    route: Paths.ScanPaymentUrl,
  },
];

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
