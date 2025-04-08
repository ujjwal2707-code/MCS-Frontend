import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '@navigation/bottom-tab-params';
import {Paths} from '@navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

type ContactProps = BottomTabScreenProps<BottomTabParamList, Paths.Contact>;

const Contact: React.FC<ContactProps> = () => {
  return (
    <ScreenLayout>
      <ScreenHeader name="Contact Us" />
      <View style={styles.container}>
        <CustomText style={[styles.bodyText, styles.mb4]}>
          <CustomText fontFamily="Montserrat-Bold" style={styles.bold}>
            Office of Additional Director General of Police(Cyber)
          </CustomText>
          {'\n'}
          Maharashtra State Cyber Headquarters, Building No 102 & 103, MIDC,
          {'\n'}
          Millenium Business Park, Sector-2, Mahape,
          {'\n'}
          Navi Mumbai-400710
        </CustomText>

        <CustomText style={[styles.bodyText, styles.mb2]}>
          <CustomText fontFamily="Montserrat-Bold" style={styles.bold}>
            Email:
          </CustomText>
          {'\n'}
          control.cpaw-mah@gov.in
        </CustomText>

        <CustomText style={styles.bodyText}>
          <CustomText fontFamily="Montserrat-Bold" style={styles.bold}>
            Phone No:
          </CustomText>
          {'\n'}
          1945
        </CustomText>

        {/* <CustomText style={[styles.bodyText, styles.mt2]}>
          <CustomText fontFamily="Montserrat-Bold" style={styles.bold}>
            Helpline No (Brush of Hope)
          </CustomText>
          {'\n'}
          022-65366666
        </CustomText> */}
      </View>
      <BackBtn />
    </ScreenLayout>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
  },
  center: {
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#fff',
  },
  bold: {
    fontWeight: '600',
  },
  mb4: {
    marginBottom: 16,
  },
  mb2: {
    marginBottom: 8,
  },
  mt2: {
    marginTop: 8,
  },
});
