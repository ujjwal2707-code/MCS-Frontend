import React, {useContext, useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, Linking} from 'react-native';

import Dropdown, {DropdownItem} from '../components/dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';

// Define type for each step
interface StepData {
  title: string;
  ussdCode: string;
}

const stepsData: Record<string, Record<string, StepData>> = {
  airtel: {
    step1: {title: 'Step 1: Disable All Call Forwarding', ussdCode: '##002#'},
    step2: {title: 'Step 2: Disable Forwarding on Busy', ussdCode: '*21#'},
    step3: {title: 'Step 3: Disable Forwarding on No Reply', ussdCode: '*67#'},
  },
  jio: {
    step1: {
      title: 'Step 1: Cancel Unconditional Call Forwarding',
      ussdCode: '##002#',
    },
    step2: {
      title: 'Step 2: Cancel Conditional Call Forwarding',
      ussdCode: '*61#',
    },
  },
  vi: {
    step1: {title: 'Step 1: Cancel All Call Forwarding', ussdCode: '##002#'},
    step2: {
      title: 'Step 2: Disable Forwarding When Unreachable',
      ussdCode: '*62#',
    },
    step3: {title: 'Step 3: Disable Forwarding on No Answer', ussdCode: '*67#'},
  },
  bsnl: {
    step1: {
      title: 'Step 1: Disable Unconditional Call Forwarding',
      ussdCode: '##002#',
    },
    step2: {title: 'Step 2: Disable Forwarding on Busy', ussdCode: '*21#'},
    step3: {title: 'Step 3: Disable Forwarding on No Reply', ussdCode: '*67#'},
    step4: {
      title: 'Step 4: Disable Forwarding When Unreachable',
      ussdCode: '*62#',
    },
  },
};

const OtpSecurity: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('airtel');
  const [completedSteps, setCompletedSteps] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'otpSecurity';
  const [modalVisible, setModalVisible] = useState(true);
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };
  useEffect(() => {
    setModalVisible(!alertSettings[alertKey]);
  }, [alertSettings[alertKey]]);

  const items: DropdownItem[] = [
    {label: 'Airtel', value: 'airtel'},
    {label: 'Jio', value: 'jio'},
    {label: 'VI', value: 'vi'},
    {label: 'BSNL', value: 'bsnl'},
  ];

  const handleDialUSSD = async (ussdCode: string, stepKey: string) => {
    const formattedCode = ussdCode.replace(/#/g, '%23');
    const telUrl = `tel:${formattedCode}`;

    try {
      await Linking.openURL(telUrl);
      setCompletedSteps(prev => ({
        ...prev,
        [selectedValue]: {...(prev[selectedValue] || {}), [stepKey]: true},
      }));
    } catch (error) {
      console.error('Error opening dialer:', error);
    }
  };

  return (
    <ScreenLayout>
      <ScreenHeader name="Check Forwardings" />
      <View style={{paddingVertical: 30}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Select your SIM provider
        </CustomText>
      </View>

      <View style={styles.dropdownSection}>
        <Dropdown
          items={items}
          selectedValue={selectedValue}
          onValueChange={(value: string) => setSelectedValue(value)}
        />
      </View>

      <View style={{marginTop: 15}}>
        <CustomText
          variant="h5"
          fontFamily="Montserrat-Regular"
          style={{color: '#FFFFFF', fontSize: 16, textAlign: 'center'}}>
          Tap on each step to dial and disable the corresponding call forwarding
          method.
        </CustomText>
      </View>

      <View style={styles.stepsContainer}>
        {Object.entries(stepsData[selectedValue]).map(([key, step]) => (
          <Pressable
            key={key}
            onPress={() => handleDialUSSD(step.ussdCode, key)}
            style={styles.stepButton}>
            <View style={{width: '80%'}}>
              <CustomText
                variant="h6"
                color="#fff"
                fontFamily="Montserrat-Bold">
                {step.title}
              </CustomText>
            </View>
            <View>
              {completedSteps[selectedValue]?.[key] && (
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={30}
                  color="#fff"
                />
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {modalVisible && (
        <AlertBox
          isOpen={modalVisible}
          onClose={closeModal}
          onDontShowAgain={handleDontShowAgain}>
          <CustomText
            fontFamily="Montserrat-Medium"
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
            }}>
            Cyber criminals use malware to intercept OTPs and bypass security
            layers. Monitoring suspicious activities related to OTP theft
            ensures that authentication codes remain private and protected.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  dropdownSection: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  stepButton: {
    backgroundColor: '#1D4ED8',
    padding: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
});

export default OtpSecurity;
