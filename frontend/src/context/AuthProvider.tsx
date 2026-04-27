import { useEffect, useState, useCallback } from "react";
import React from "react";
import { AUTH_DATA } from "../constants";
import { authAPI } from "../services/api";
import { AuthContext } from "./AuthContext";
import type { MerchantSignUpAuth, SignInAuth } from "@paylink/shared";

const parseStoredUser = () => {
  const raw = localStorage.getItem(AUTH_DATA.PAYLINK_USER);
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    return JSON.parse(raw) as MerchantSignUpAuth;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<MerchantSignUpAuth | null>(() =>
    parseStoredUser(),
  );
  const [loading, setLoading] = useState(false);

  // verify token on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN);
    const storedUser = parseStoredUser();

    if (!token) {
      setLoading(false);
      console.error("Token does not exist in storage");
      return;
    }

    if (!storedUser) {
      setLoading(false);
      console.error("User does not exist in storage");
      return;
    }

    const tokenExpiry = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN_EXPIRY);
    if (!tokenExpiry) console.error("Token expiry does not exist in storage");
    const tokenExpiryMs = Number(tokenExpiry);
    const nowMs = Date.now();

    setUser(storedUser);

    if (tokenExpiryMs < nowMs) {
      authAPI.me(storedUser.id as string).finally(() => setLoading(false));
    }
  }, []);

  const registerUser = useCallback(async (data: MerchantSignUpAuth) => {
    const res = await authAPI.register(data);
    const { token, user } = res.data;

    if (token) {
      localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token);
    }

    if (user) {
      localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
      setUser(user);
    }

    return res.data;
  }, []);

  const logIn = useCallback(async (data: SignInAuth) => {
    const res = await authAPI.login(data);
    const { accessToken: token, user, expiresIn } = res.data;

    if (token) {
      localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token);
    }

    if (user) {
      localStorage.setItem(AUTH_DATA.PAYLINK_USER, JSON.stringify(user));
      setUser(user);
    }

    if (typeof expiresIn === "number") {
      localStorage.setItem(
        AUTH_DATA.PAYLINK_TOKEN_EXPIRY,
        String(expiresIn + Date.now() - 60_000),
      );
    }

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
