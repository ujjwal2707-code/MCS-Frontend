import {useEffect, useRef, useState} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';

interface OtpInputProps {
  length: number;
  onOtpSubmit?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  onOtpSubmit = () => {},
}) => {
  const [otp, setOtp] = useState<string[]>(Array.from({length}, () => ''));
  const inputRefs = useRef<(TextInput | null)[]>(
    Array.from({length}, () => null),
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({length}).map((_, index) => (
        <TextInput
          key={index}
          ref={el => {
            inputRefs.current[index] = el;
          }}
          value={otp[index]}
          onChangeText={text => handleChange(index, text)}
          onFocus={() => handleClick(index)}
          onKeyPress={({nativeEvent}) => handleKeyDown(index, nativeEvent.key)}
          keyboardType="numeric"
          maxLength={1}
          style={styles.input}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 48, 
    height: 48,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    color: 'white',
    fontSize: 18, 
    marginLeft: 8,
  },
});

export default OtpInput;
