import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Profile, Contact} from '../screens';
import {Paths} from './paths';
import {BottomTabParamList} from './bottom-tab-params';
import {Image} from 'react-native';

import homeIcon from '@assets/icons/home.png';
import profileIcon from '@assets/icons/profile.png';
import contactIcon from '@assets/icons/contact.png';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Paths.Home}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconSource;

          if (route.name === Paths.Home) {
            iconSource = homeIcon;
          } else if (route.name === Paths.Profile) {
            iconSource = profileIcon;
          } else if (route.name === Paths.Contact) {
            iconSource = contactIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{width: size, height: size, tintColor: color}}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: '#5A29FD',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}>
      <Tab.Screen name={Paths.Home} component={Home} />
      <Tab.Screen name={Paths.Profile} component={Profile} />
      <Tab.Screen name={Paths.Contact} component={Contact} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
