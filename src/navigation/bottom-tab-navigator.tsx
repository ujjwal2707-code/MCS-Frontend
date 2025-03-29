import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Profile, Contact} from '../screens';
import {Paths} from './paths';
import {BottomTabParamList} from './bottom-tab-params';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Paths.Home}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === Paths.Home) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === Paths.Profile) {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === Paths.Contact) {
            iconName = focused ? 'phone' : 'phone-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={30} color={color} />
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
