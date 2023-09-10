import { useContext } from 'react';
import jwtDecode from 'jwt-decode';

import AuthContext from './context';
import authStorage from './storage';

export default () => {
  const { user, setUser }: any = useContext(AuthContext);

  const logIn = (authToken: string) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    authStorage.removeToken();
    setUser(null);
  };

  return { user, logIn, logOut };
};
