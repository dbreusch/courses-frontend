// global state information
import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  isAdmin: false,
  token: null,
  login: () => {},
  logout: () => {}
});
