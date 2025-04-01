import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';

import Dropdown, {DropdownItem} from '../components/dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';

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
      <ScreenHeader name="OTP Security" />
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
        {/* <CustomText>Select Your Sim Provider</CustomText> */}
        <Dropdown
          items={items}
          selectedValue={selectedValue}
          onValueChange={(value: string) => setSelectedValue(value)}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  dropdownSection: {
    paddingVertical: 5,
    paddingHorizontal:20
  },
});

export default OtpSecurity;
