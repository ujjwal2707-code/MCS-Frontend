import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from 'react-native';
import CustomText from './custom-text';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  disabled,
  title,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton]}>
      <CustomText
        style={{textAlign: 'center'}}
        variant="h4"
        fontFamily="Montserrat-Bold"
        color={disabled ? 'gray' : 'black'}>
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonSpacing: {
    margin: 10,
  },
  button: {
    backgroundColor: '#5FFFAE',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});
