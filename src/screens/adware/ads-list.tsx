import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RootScreenProps } from '@navigation/types'
import { Paths } from '@navigation/paths'
import ScreenLayout from '@components/screen-layout'
import ScreenHeader from '@components/screen-header'
import CustomText from '@components/ui/custom-text'

const AdsList = ({route}: RootScreenProps<Paths.AdsList>) => {
  const { app, ads } = route.params;
  console.log(app,ads)
  return (
    <ScreenLayout>
      <ScreenHeader name={app.name} />
      <View style={{paddingVertical: 20}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Ads List
        </CustomText>
      </View>
      <FlatList
        data={ads}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.appContainer}>
            <CustomText fontFamily="Montserrat-Medium" color="#fff">
              {item}
            </CustomText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </ScreenLayout>
  )
}

export default AdsList

const styles = StyleSheet.create({
  appContainer: {
    padding:5
  },
  divider: {
    backgroundColor: '#FFF',
    height: 1,
    marginVertical: 8,
  },
})