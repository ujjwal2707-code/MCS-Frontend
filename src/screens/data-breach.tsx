import {
  View,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {useAuth} from '@context/auth-context';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import InputField from '@components/ui/input-field';
import CustomButton from '@components/ui/custom-button';
import CustomText from '@components/ui/custom-text';
import {Card, Divider} from 'react-native-paper';

let content = [
  'Change your password immediately.',
  'Enable two-factor authentication.',
  'Do not reuse passwords.',
];

interface ErrorResponse {
  Error: string;
  email: string;
}

interface DataBreachResponse {
  breaches: string[][];
  email: string;
}

const DataBreach = () => {
  const {token} = useAuth();
  let [email, setEmail] = useState('');
  const [errorData, setErrorData] = useState<ErrorResponse | null>(null);
  const [resultData, setResultData] = useState<DataBreachResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkDataBreach = async () => {
    if (!email || !email.trim()) return;
    setErrorData(null);
    setResultData(null);

    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const encodedEmail = encodeURIComponent(trimmedEmail);
      const {data} = await axios.get<DataBreachResponse>(
        `https://api.xposedornot.com/v1/check-email/${encodedEmail}`,
      );

      setResultData(data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponseData = error.response.data as ErrorResponse;
        setErrorData(errorResponseData);
      } else {
        setErrorData({Error: error.message, email});
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user
  const {data: user, isLoading} = useQuery({
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
    retry: false, // Prevent retrying if token is missing
  });

  useEffect(() => {
    if (user.email === 'bigaja9282@flektel.com') {
      return;
    } else {
      setEmail(user.email);
    }
  }, [user]);

  const inputDefaultValue =
    user.email === 'bigaja9282@flektel.com' ? email : user.email;

  return (
    <ScreenLayout>
      <ScreenHeader name="Data Breach" />
      <View style={{paddingVertical: 30}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Enter an Email
        </CustomText>
      </View>
      <View
        style={{
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: '100%'}}>
          <InputField
            placeholder="Enter email"
            textContentType="emailAddress"
            defaultValue={inputDefaultValue}
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View style={{marginTop: 20, width: '50%'}}>
          <CustomButton
            bgVariant="secondary"
            title={errorData || resultData ? 'CHECK AGAIN' : 'CHECK BREACH'}
            textVariant="secondary"
            onPress={checkDataBreach}
            isDisabled={!email}
            isLoading={loading}
          />
        </View>
      </View>

      {/* No breach found */}
      {errorData && (
        <View style={styles.errorContainer}>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Bold"
            style={styles.errorText}>
            {errorData.Error}
          </CustomText>
        </View>
      )}

      {/* Breach found */}
      {resultData && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              {resultData.breaches.map((group, groupIndex) => (
                <View style={styles.cardItemContainer}>
                  {group.map((breach, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding:2
                        }}>
                        <CustomText
                          variant="h5"
                          fontFamily="Montserrat-Medium"
                          color="#fff"
                          key={`breach-${index}`}>
                          {breach}
                        </CustomText>
                        <View style={[styles.badge, styles.unsecure]}>
                          <CustomText style={styles.badgeText}>
                            Breach Detected
                          </CustomText>
                        </View>
                      </View>
                      {index < group.length - 1 && (
                        <Divider style={styles.divider} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              ))}
            </Card.Content>
          </Card>

          <Card
            style={{
              borderRadius: 70,
              backgroundColor: '#FE3A39', // #ef4444
              marginTop: 30,
              padding: 0,
            }}>
            <Card.Content>
              <CustomText
                variant="h6"
                fontFamily="Montserrat-Bold"
                color="#fff"
                style={{textAlign: 'center'}}>
                Actions to be taken:
              </CustomText>
              {content?.map((line, index) => (
                <CustomText
                  variant="h6"
                  fontFamily="Montserrat-Bold"
                  color="#fff"
                  key={index}
                  style={{textAlign: 'center'}}>
                  • {line}
                </CustomText>
              ))}
            </Card.Content>
          </Card>
        </>
      )}
    </ScreenLayout>
  );
};

export default DataBreach;

const styles = StyleSheet.create({
  errorContainer: {
    width: '100%',
    padding: 14,
    backgroundColor: '#4ade80',
    borderRadius: 8,
    marginTop: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  errorText: {
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#FE3A39', // #ef4444 // #FE3A39
    marginTop: 10,
    padding: 0,
  },
  cardItemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 4,
    width: '100%',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  unsecure: {
    backgroundColor: '#FE3A38', // #FE3A38
    borderWidth: 1,
    borderColor: '#fff'
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
  },
});
