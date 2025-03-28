import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Profile, Contact} from '../screens';
import {Paths} from './paths';
import {BottomTabParamList} from './bottom-tab-params';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Paths.Home}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name={Paths.Home} component={Home} />
      <Tab.Screen name={Paths.Profile} component={Profile} />
      <Tab.Screen name={Paths.Contact} component={Contact} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
