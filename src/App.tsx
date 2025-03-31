import React, {useState} from 'react';
import ApplicationNavigator from './navigation/application';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AuthProvider from './context/auth-context';
import {PaperProvider} from 'react-native-paper';

function App(): React.JSX.Element {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider>
          <ApplicationNavigator />
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
