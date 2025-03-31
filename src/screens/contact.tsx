import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@navigation/bottom-tab-params';
import { Paths } from '@navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';

type ProfileProps = BottomTabScreenProps<BottomTabParamList, Paths.Contact>;

const Contact: React.FC<ProfileProps> = ({navigation, route}) => {
  return (
    <ScreenLayout>
      <ScreenHeader name='Contact Us' />
    </ScreenLayout>
  )
}

export default Contact

const styles = StyleSheet.create({})