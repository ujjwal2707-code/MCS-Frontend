import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FullScreenLoader from "../components/full-screen-loader";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  setAuthToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from AsyncStorage when the app starts
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      setToken(storedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

//   useEffect(() => {
//     // Redirect user based on authentication status
//     if (!isLoading) {
//       if (!token) {
//         router.replace("/sign-in");
//       }
//     }
//   }, [token, isLoading]);

  const setAuthToken = async (newToken: string) => {
    await AsyncStorage.setItem("authToken", newToken);
    console.log(newToken)
    setToken(newToken);
    // router.replace("/");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    setToken(null);
    // router.replace("/sign-in");
  };

  if (isLoading) {
    return (
      <FullScreenLoader />
    );
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;