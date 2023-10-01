import { useContext } from 'react';
import jwtDecode from 'jwt-decode';

import AuthContext from './context';
import authStorage from './storage';
import { User } from '../api/auth';

interface userProps {
  user: User | null,
  setUser: (user: User | null)=> void
}

export default () => {
  const { user, setUser }: userProps = useContext<userProps>(AuthContext as any);

  const logIn = (authToken: string) => {
    const user: User = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    authStorage.removeToken();
    setUser(null);
  };

  return { user, setUser, logIn, logOut };
};
