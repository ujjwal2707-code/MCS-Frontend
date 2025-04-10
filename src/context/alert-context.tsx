import React, {createContext, useState, ReactNode} from 'react';

interface AlertSettings {
  [key: string]: boolean;
}

interface AlertContextType {
  alertSettings: AlertSettings;
  setAlertSetting: (screenKey: string, value: boolean) => void;
}

export const AlertContext = createContext<AlertContextType>({
  alertSettings: {},
  setAlertSetting: () => {},
});

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({children}: AlertProviderProps) => {
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({});

  const setAlertSetting = (screenKey: string, value: boolean) => {
    setAlertSettings(prev => ({
      ...prev,
      [screenKey]: value,
    }));
  };

  return (
    <AlertContext.Provider value={{alertSettings, setAlertSetting}}>
      {children}
    </AlertContext.Provider>
  );
};
