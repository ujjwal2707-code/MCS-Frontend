import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import BackBtn from '@components/back-btn';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/types';
import {Paths} from '@navigation/paths';
import {useDataBreachChecker} from '../hooks/useDataBreachChecker';
import {Card, Divider} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import {useAuth} from '@context/auth-context';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, Paths.Home>;

const PhoneScanIos = () => {
  const navigation = useNavigation<NavigationProp>();
  const {loading, errorData, resultData, checkDataBreach} =
    useDataBreachChecker();

  const {token} = useAuth();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is missing');

      const response = await apiService.getUserProfile(token);
      if (!response) {
        throw new Error('API call failed: No response received.');
      }
      if (response.status !== 200) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }
      if (!response.data || !response.data.success) {
        throw new Error('Invalid API response format.');
      }

      return response.data.data;
    },
    staleTime: 0,
    retry: false,
  });

  useEffect(() => {
    const init = async () => {
      await checkDataBreach(user?.email);
    };
    init();
  }, [user]);
  return (
    <ScreenLayout>
      <ScreenHeader name="Your Security Checklist" />

      <Card style={styles.card}>
        <Card.Content>
          <CustomText
            color="#FFF"
            variant="h4"
            fontFamily="Montserrat-SemiBold"
            fontSize={18}>
            Data Breach Report
          </CustomText>
          <Divider style={styles.divider} />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            {errorData ? (
              <CustomText
                color="#FFF"
                variant="h4"
                fontFamily="Montserrat-Regular"
                fontSize={14}>
                No Data Breaches found.
              </CustomText>
            ) : (
              <CustomText
                color="red"
                variant="h4"
                fontFamily="Montserrat-Regular"
                fontSize={14}>
                Data Breaches found.
              </CustomText>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate(Paths.DataBreach)}>
              <Ionicons name="chevron-forward-sharp" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <CustomText
            color="#FFF"
            variant="h4"
            fontFamily="Montserrat-SemiBold"
            fontSize={18}>
            Check Forwardings
          </CustomText>
          <Divider style={styles.divider} />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <CustomText
              color="#fff"
              variant="h4"
              fontFamily="Montserrat-Regular"
              fontSize={14}>
              Check Forwardings Theft.
            </CustomText>

            <TouchableOpacity
              onPress={() => navigation.navigate(Paths.OtpSecurity)}>
              <Ionicons name="chevron-forward-sharp" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <BackBtn />
    </ScreenLayout>
  );
};

export default PhoneScanIos;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#2337A8', // #2337A8
    paddingVertical: 10,
    marginTop: 20,
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
    marginHorizontal: 0,
  },
});
