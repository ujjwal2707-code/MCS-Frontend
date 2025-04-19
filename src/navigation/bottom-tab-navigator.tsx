import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Profile, Contact, Share} from '../screens';
import {Paths} from './paths';
import {BottomTabParamList} from './bottom-tab-params';
import {Image, Platform} from 'react-native';

import homeIcon from '@assets/icons/home.png';
import profileIcon from '@assets/icons/profile.png';
import contactIcon from '@assets/icons/contact.png';
import shareIcon from '@assets/icons/share.png';

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
          } else if (route.name === Paths.Share) {
            iconSource = shareIcon;
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
          ...Platform.select({
            android: {
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            ios: {
              height: 75,
              paddingBottom: 10,
              paddingTop: 10,
            },
          }),
        },
      })}>
      <Tab.Screen
        name={Paths.Home}
        component={Home}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name={Paths.Profile}
        component={Profile}
        options={{tabBarLabel: 'Profile'}}
      />
      <Tab.Screen
        name={Paths.Contact}
        component={Contact}
        options={{tabBarLabel: 'Contact'}}
      />
      <Tab.Screen
        name={Paths.Share}
        component={Share}
        options={{tabBarLabel: 'Share'}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
