import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import AppLoading from 'expo-app-loading';

import { navigationRef } from './src/navigation/rootNavigation';
import navigationTheme from './src/navigation/navigationTheme';
import authStorage from './src/auth/storage';
import AuthContext from './src/auth/context';
import RootNavigator, { User } from './src/navigation/RootNavigator';

export default function App() {
  const [user, setUser] = useState<User>();
  const [isReady, setIsReady] = useState<boolean>(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onError={console.warn}
        onFinish={() => setIsReady(true)}
      />
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <RootNavigator user={user} />
        <FlashMessage position="bottom" />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
