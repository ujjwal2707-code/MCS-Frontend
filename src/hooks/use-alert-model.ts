// useAlertModal.ts
import { useState, useContext, useEffect } from 'react';
import { AlertContext } from '@context/alert-context';

export const useAlertModal = (alertKey: string) => {
  const { alertSettings, setAlertSetting } = useContext(AlertContext);
  
  // Set initial visibility: if no preference exists (undefined), show the modal (true)
  const initialVisibility = alertSettings[alertKey] === undefined ? true : !alertSettings[alertKey];
  const [modalVisible, setModalVisible] = useState<boolean>(initialVisibility);

  const closeModal = () => setModalVisible(false);

  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };

  useEffect(() => {
    // Only update modalVisible if the preference has been defined; otherwise, keep default as true.
    if (alertSettings[alertKey] !== undefined) {
      setModalVisible(!alertSettings[alertKey]);
    }
  }, [alertSettings, alertKey]);

  return { modalVisible, closeModal, handleDontShowAgain };
};
