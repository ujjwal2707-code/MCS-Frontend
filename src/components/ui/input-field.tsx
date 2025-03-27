import React from 'react';
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import CustomText from './custom-text';

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  className?: string;
}

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
           {label && <CustomText style={[styles.label]}>{label}</CustomText>} 
          <View style={[styles.inputContainer, containerStyle]}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
            <TextInput
              style={[styles.input, inputStyle]}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F3F4F6', // #F3F4F6
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  input: {
    borderRadius: 50,
    padding: 14,
    fontSize: 15,
    flex: 1,
    textAlign: 'left',
    color:'#F3F4F6' // #F3F4F6
  },
});

export default InputField;
