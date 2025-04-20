import {useState} from 'react';
import axios from 'axios';

interface ErrorResponse {
  Error: string;
  email: string;
}

interface DataBreachResponse {
  breaches: string[][];
  email: string;
}

export const useDataBreachChecker = () => {
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorResponse | null>(null);
  const [resultData, setResultData] = useState<DataBreachResponse | null>(null);

  const checkDataBreach = async (email: string) => {
    if (!email || !email.trim()) return;

    setErrorData(null);
    setResultData(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const encodedEmail = encodeURIComponent(trimmedEmail);

      const {data} = await axios.get(
        `https://api.xposedornot.com/v1/check-email/${encodedEmail}`,
      );

      if (data.Error === 'Not found') {
        setErrorData(data);
      } else {
        setResultData(data);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorData,
    resultData,
    checkDataBreach,
  };
};
