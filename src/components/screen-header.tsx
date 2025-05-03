import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from './ui/custom-text';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomButton from './ui/custom-button';

interface ScreenHeaderProps {
  name?: string;
}

const ScreenHeader = ({name}: ScreenHeaderProps) => {
  const [SOSModalVisible, setSOSModalVisible] = useState(false);

  const handleSOSPress = () => {
    setSOSModalVisible(true);
  };

  const handleCloseSOSModal = () => {
    setSOSModalVisible(false);
  };

  const handleDialCyberCrime = async () => {
    const no = '1945';
    const telUrl = `tel:${no}`;

    try {
      await Linking.openURL(telUrl);
    } catch (error) {
      console.error('Error opening dialer:', error);
    }
  };
  const handleDialCrime = async () => {
    const no = '112';
    const telUrl = `tel:${no}`;

    try {
      await Linking.openURL(telUrl);
    } catch (error) {
      console.error('Error opening dialer:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {/* <Image
            source={require('@assets/images/notification.png')}
            style={styles.notifyImage}
          /> */}
          <TouchableOpacity
            onPress={handleSOSPress}
            style={styles.sosContainer}>
            <CustomText style={styles.sosText}>SOS</CustomText>
          </TouchableOpacity>
        </View>
        {name && (
          <CustomText
            variant="h5"
            fontFamily="Montserrat-SemiBold"
            color="white"
            style={{textAlign: 'center'}}>
            {name}
          </CustomText>
        )}

        <Modal visible={SOSModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={{paddingVertical: 10, width: '100%', gap: 20}}>
                <CustomButton
                  title="Report Cyber Crime"
                  IconLeft={() => (
                    <Ionicons name="call" size={24} color="black" />
                  )}
                  onPress={handleDialCyberCrime}
                />
                <CustomButton
                  title="Report Any Other Crime"
                  IconLeft={() => (
                    <Ionicons name="call" size={24} color="black" />
                  )}
                  onPress={handleDialCrime}
                />
              </View>
              <View style={{paddingVertical: 10}}>
                <CustomButton
                  title="Close"
                  bgVariant="danger"
                  textVariant="danger"
                  onPress={handleCloseSOSModal}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {/* <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.actions}>
          <Image
            source={require('@assets/images/notify.png')}
            style={styles.notifyImage}
          />
          <View style={styles.sosContainer}>
            <CustomText style={styles.sosText}>SOS</CustomText>
          </View>
        </View>
      </View>
      {name && (
        <CustomText
          variant="h5"
          fontFamily="Montserrat-SemiBold"
          color="white"
          style={{textAlign: 'center'}}>
          {name}
        </CustomText>
      )}
    </View> */}
    </>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // updated to push SOS to the right
    paddingHorizontal: 0, // optional: adds a little space from edges
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifyImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  sosContainer: {
    width: 30, // increased size slightly to make it look better
    height: 30,
    backgroundColor: '#DC2626',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2337A8',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
});
