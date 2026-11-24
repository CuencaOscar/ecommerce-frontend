import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { request, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore the session from stored tokens on first load.
  useEffect(() => {
    if (!tokenStore.get()) {
      setReady(true);
      return;
    }
    request('/auth/me/')
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email, password) => {
    const tokens = await request('/auth/token/', {
      method: 'POST', body: { username: email.toLowerCase(), password }, auth: false,
    });
    tokenStore.set(tokens);
    setUser(await request('/auth/me/'));
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    const data = await request('/auth/register/', {
      method: 'POST', body: { name, email, password }, auth: false,
    });
    tokenStore.set({ access: data.access, refresh: data.refresh });
    setUser(data.user);
  }, []);

  const signOut = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user, ready, signIn, signUp, signOut,
  }), [user, ready, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export const useAuth = () => useContext(AuthContext);
