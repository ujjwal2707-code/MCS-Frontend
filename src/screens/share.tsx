import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {Card} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import BackBtn from '@components/back-btn';

const Share = () => {
  const sharableLink = 'www.google.com';

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'The URL has been copied to your clipboard!');
  };
  return (
    <ScreenLayout>
      <ScreenHeader />

      <Card style={styles.card}>
        <Card.Content>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Bold">
              {sharableLink}
            </CustomText>
            <TouchableOpacity onPress={() => copyToClipboard(sharableLink)}>
              <MaterialCommunityIcons
                name="content-copy"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      <BackBtn />
    </ScreenLayout>
  );
};

export default Share;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#2337A8', // #2337A8 // #4E4E96 // #2337A8
    marginTop: 20,
    padding: 0,
  },
});
