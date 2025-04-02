import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from './ui/custom-text';

export interface DropdownItem {
  label: string;
  value: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedValue,
  onValueChange,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.dropdownButton}>
        <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
          {selectedItem ? selectedItem.label : 'Select an option'}
        </CustomText>

        <Ionicons name="chevron-down-sharp" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={items}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}>
                  <CustomText
                    variant="h5"
                    color="#fff"
                    fontFamily="Montserrat-Medium">
                    {item.label}
                  </CustomText>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB', // Tailwind gray-300 equivalent
    borderRadius: 20,
    padding: 12,
  },
  // dropdownButtonText: {
  //   fontFamily: 'Rubik',
  //   color: '#ffffff',
  // },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#2337A8',
    borderRadius: 12,
    width: 320,
  },
  itemButton: {
    padding: 12,
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 4,
  },
});

export default Dropdown;
