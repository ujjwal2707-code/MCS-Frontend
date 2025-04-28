import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import CustomText from './ui/custom-text';
import CustomButton from './ui/custom-button';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AppBarProps {
  username: string;
}

const AppBar = ({username}: AppBarProps) => {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.textContainer}>
            <CustomText style={styles.textSmall}>Welcome</CustomText>
            <CustomText fontFamily="Montserrat-Bold" style={styles.textLarge}>
              {username?.split(' ')[0]}
            </CustomText>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            marginTop: 16,
          }}>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Bold"
            color="white"
            style={{textAlign: 'center'}}>
            MahaCyber
          </CustomText>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Bold"
            color="white"
            style={{textAlign: 'center', color: '#5FFFAE'}}>
            Safe
          </CustomText>
        </View>

        <View style={styles.actions}>
          {/* <Bell color="white" size={20} /> */}
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
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    paddingVertical: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 8,
    justifyContent: 'center',
  },
  textSmall: {
    fontSize: 12,
    color: 'white',
  },
  textLarge: {
    fontSize: 16,
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom:5
  },
  notifyImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  sosContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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

export default AppBar;
