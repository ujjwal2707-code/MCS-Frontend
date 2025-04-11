import React from 'react';
import {Modal, StyleSheet, Text, View, Pressable} from 'react-native';
import CustomText from './ui/custom-text';

interface AlertBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain?: () => void;
  children?: React.ReactNode;
}

const AlertBox = ({
  isOpen,
  onClose,
  onDontShowAgain,
  children,
}: AlertBoxProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <CustomText style={styles.closeButtonText}>×</CustomText>
          </Pressable>
          {children}
          <Pressable
            style={styles.dontShowAgainButton}
            onPress={onDontShowAgain ? onDontShowAgain : onClose}>
            <CustomText
              variant="h6"
              color="black"
              fontSize={14}
              fontFamily="Montserrat-Medium">
              Don’t show again
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    width: '85%',
    backgroundColor: '#4E4E96', // #4E4E96
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    left: -15,
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dontShowAgainButton: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
