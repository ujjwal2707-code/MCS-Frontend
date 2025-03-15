import {
  FlatList,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Paths} from '../navigation/paths';
import {RootScreenProps} from '../navigation/types';
import FeatureTile from '../components/feauture-tile';
import { featureTiles } from '../constants/constants';



const Home = ({navigation}: RootScreenProps<Paths.Home>) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}>
      <FlatList
        data={featureTiles}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => (
          <FeatureTile
            icon={item.icon}
            label={item.label}
            onPress={() => {
              console.log('Navigating to:', item.route);
              navigation.navigate(item.route);
            }}
          />
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default Home;
