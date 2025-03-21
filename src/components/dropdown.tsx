import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";

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
  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.dropdownButton}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedItem ? selectedItem.label : "Select an option"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // Tailwind gray-300 equivalent
    borderRadius: 4,
    padding: 12,
  },
  dropdownButtonText: {
    fontFamily: "Rubik",
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: 320, // roughly equivalent to Tailwind's w-80
  },
  itemButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // Tailwind gray-200 equivalent
  },
  itemText: {
    // Additional styling if needed.
  },
});

export default Dropdown;
