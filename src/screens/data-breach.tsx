import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';

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
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}>
          <Text style={styles.navText}>Data Breach</Text>

          <View style={styles.userContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={email}
              onChangeText={value => setEmail(value)}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!email || loading) && styles.disabledButton,
              ]}
              onPress={() => checkDataBreach()}
              disabled={!email || loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Check Breach</Text>
              )}
            </TouchableOpacity>
          </View>

          {resultData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Data Breach Detected</Text>
              {resultData.breaches.map((group, groupIndex) => (
                <View key={`group-${groupIndex}`} style={styles.groupContainer}>
                  {group.map((breach, index) => (
                    <Text key={`breach-${index}`} style={styles.breachText}>
                      🔹 {breach}
                    </Text>
                  ))}
                </View>
              ))}

              <Text style={styles.actionTitle}>Actions to be taken:</Text>
              {content?.map((line, index) => (
                <Text key={index} style={styles.actionText}>
                  🔹{line}
                </Text>
              ))}
            </View>
          )}

          {errorData && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorData.Error}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DataBreach;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    width: '100%',
    paddingHorizontal: 8, // Equivalent to px-2
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 128, // Equivalent to pb-32
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
  },
  userContainer: {
    width: '100%',
    paddingVertical: 20, // Equivalent to py-5
    paddingHorizontal: 12, // Equivalent to px-3
  },
  inputField: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    // color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#87cefa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    // fontFamily:''
  },
  resultContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ef4444',
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
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    // color: '#fff',
  },
  groupContainer: {
    marginTop: 20,
  },
  breachText: {
    fontSize: 18,
    color: '#fff',
  },
  actionTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    // color: '#fff',
  },
  actionText: {
    fontSize: 18,
    // color: '#fff',
  },
  errorContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4ade80', // Tailwind green-400
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
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#fff',
    textAlign: 'center',
  },
});
