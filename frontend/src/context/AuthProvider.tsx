import { useEffect, useState, useCallback } from "react";
import React from "react";
import { AUTH_DATA } from "../constants";
import { authAPI } from "../services/api";
import { AuthContext } from "./AuthContext";
import type { MerchantSignUpAuth, SignInAuth } from "@paylink/shared";

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<MerchantSignUpAuth | null>(() => {
    try {
      return JSON.parse(AUTH_DATA.PAYLINK_USER);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // verify token on mount
  useEffect(() => {
    // get token from local storage(only when storing it in local storage)
    const token = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN);
    const user = localStorage.getItem(AUTH_DATA.PAYLINK_USER);
    if (!token) {
      setLoading(false);
      console.error("Token does not exist in storage");

      return;
    }
    if (!user) {
      setLoading(false);
      console.error("User does not exist in storage");

      return;
    }
    const tokenExpiry = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN_EXPIRY);
    if (!tokenExpiry) console.error("Token expiry does not exist in storage");
    const tokenExpiryMs = Number(tokenExpiry);
    const _user: MerchantSignUpAuth = JSON.parse(user);
    const nowMs = Date.now();

    setUser(_user);

    if (tokenExpiryMs < nowMs) {
      // query user(if exists)
      authAPI
        .me(_user?.id as string)
        // .then((res) => setUser(res.data.user))
        .finally(() => setLoading(false));
    }
  }, []);

  const registerUser = useCallback(async (data: MerchantSignUpAuth) => {
    const res = await authAPI.register(data);
    const { token, user } = res.data;
    localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token || null);
    localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
    setUser(user);
    return res.data;
  }, []);

  const logIn = useCallback(async (data: SignInAuth) => {
    const res = await authAPI.login(data);
    const { accessToken: token, user, expiresIn } = res.data;
    localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token || null);
    localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
    localStorage.setItem(
      AUTH_DATA.PAYLINK_TOKEN_EXPIRY,
      JSON.stringify(expiresIn + Date.now() - 60_000),
    );
    setUser(user);
    return res;
  }, []);
  const logOut = useCallback(async () => {
    await authAPI.logout();
    localStorage.removeItem(AUTH_DATA.PAYLINK_TOKEN);
    localStorage.removeItem(AUTH_DATA.PAYLINK_USER);
    localStorage.removeItem(AUTH_DATA.PAYLINK_TOKEN_EXPIRY);

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setLoading, registerUser, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
