import { createContext, useEffect, useState, useCallback } from "react";
import React from "react";
import { AUTH_DATA } from "../constants";
import { authAPI } from "../services/api";
import { type MerchantSignUpAuth, SignInAuth } from "../../../backend/src/validators/validators";
type UserType = {
  id: string;
};


const AuthContext = createContext<{
  user: UserType | null;
  token?: string | null;
  loading: boolean;
  register: (data: MerchantSignUpAuth) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}>({
  user: null,
  token: null,
  loading: false,
  register: () => {},
  logIn: async () => {},
  logOut: () => {},
});

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(AUTH_DATA.PAYLINK_USER);
    } catch {
      return null;
    }
  });

  // verify token on mount
  useEffect(() => {
    // get token from local storage(only when storing it in local storage)
    const token = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN);

    if (!token) {
      setLoading(false);
      return;
    }

    // query user(if exists)
    authAPI
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // if user doesn't remove auth data from local storage
        localStorage.removeItem(AUTH_DATA.PAYLINK_TOKEN);
        localStorage.removeItem(AUTH_DATA.PAYLINK_USER);
      })
      .finally(() => setLoading(false));
  }, []);
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (data: MerchantSignUpAuth) => {
    const res = await authAPI.register(data);
    const { token, user } = res.data;
    localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token || null);
    localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
    setUser(user);
  }, []);

  const logIn = useCallback(async (data: SignInAuth) => {
    const res = await authAPI.login(data);
    const { token, user } = res.data;
    localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token || null);
    localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
    setUser(user);
  }, []);
  const logOut = useCallback(() => {
     localStorage.removeItem(AUTH_DATA.PAYLINK.TOKEN);
    localStorage.removeItem();
    setUser(null);
  })

  return (
    <AuthContext.Provider value={{ user, loading, register, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
