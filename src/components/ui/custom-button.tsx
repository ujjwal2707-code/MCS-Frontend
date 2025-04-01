import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import {ButtonProps} from 'types/types';
import CustomText from './custom-text';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return {backgroundColor: '#2337A7'}; // #6b7280
    case 'danger':
      return {backgroundColor: '#ef4444'}; // #ef4444
    // case 'success':
    //   return {backgroundColor: '#22c55e'}; // #22c55e
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: '#d1d5db', // #d1d5db
        borderWidth: 0.5,
      };
    default:
      return {backgroundColor: '#5DFFAE'}; // #5DFFAE
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return {color: 'black'};
    case 'secondary':
      return {color: '#f3f4f6'}; // #f3f4f6
    case 'danger':
      return {color: '#fecaca'}; // #fecaca
    case 'success':
      return {color: '#bbf7d0'}; // #bbf7d0
    default:
      return {color: 'white'};
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  isLoading = false,
  isDisabled = false,
  style,
  ...props
}: ButtonProps) => {
  const isButtonDisabled = isDisabled || isLoading;

  return (
    <TouchableOpacity
      onPress={isButtonDisabled ? undefined : onPress}
      disabled={isButtonDisabled}
      style={[
        styles.button,
        getBgVariantStyle(bgVariant),
        isButtonDisabled && {opacity: 0.5},
        style,
      ]}
      {...props}>
      {IconLeft && !isLoading && (
        <View style={styles.iconLeft}>
          <IconLeft />
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <CustomText fontFamily='Montserrat-SemiBold' style={[styles.buttonText, getTextVariantStyle(textVariant)]}>
          {title}
        </CustomText>
      )}
      {IconRight && !isLoading && (
        <View style={styles.iconRight}>
          <IconRight />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width: '100%',
    borderRadius: 50, // fully rounded
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2.62,
    // Elevation for Android
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default CustomButton;
