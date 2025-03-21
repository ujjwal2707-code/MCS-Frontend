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

interface NavProps {
  name: string;
}
const Nav: React.FC<NavProps> = ({name}) => (
  <View style={styles.nav}>
    <Text style={styles.navText}>{name}</Text>
  </View>
);

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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}>
          <Nav name="OTP Security" />

          <View style={styles.dropdownSection}>
            <Text style={styles.sectionTitle}>Select Your Sim Provider</Text>
            <Dropdown
              items={items}
              selectedValue={selectedValue}
              onValueChange={(value: string) => setSelectedValue(value)}
            />
          </View>

          <Text style={styles.stepsTitle}>Perform these steps</Text>
          <View style={styles.stepsContainer}>
            {Object.entries(stepsData[selectedValue]).map(([key, step]) => (
              <Pressable
                key={key}
                onPress={() => handleDialUSSD(step.ussdCode, key)}
                style={styles.stepButton}>
                <Text style={styles.stepText}>{step.title}</Text>
                {completedSteps[selectedValue]?.[key] && (
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={24}
                    color="black"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0061FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  safeArea: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    paddingHorizontal: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 128,
  },
  nav: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  navText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dropdownSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: 'Rubik',
    color: '#ffffff',
    marginBottom: 8,
    fontSize: 16,
  },
  stepsTitle: {
    fontFamily: 'Rubik',
    color: '#ffffff',
    marginBottom: 8,
    fontSize: 16,
  },
  stepsContainer: {
    // Additional styling if needed.
  },
  stepButton: {
    backgroundColor: '#1D4ED8', // blue-700 equivalent
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  stepText: {
    color: '#ffffff',
    fontFamily: 'Rubik',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OtpSecurity;
