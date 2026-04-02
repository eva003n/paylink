import type {
  MerchantSignUpAuth,
  SignInAuth,
} from "@shared/schemas/validators";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

type UserType = {
  id: string;
};

export const AuthContext = createContext<{
  user: UserType | null;
  token?: string | null;
  tokenExpiry?: number;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  registerUser: (data: MerchantSignUpAuth) => Promise<any>;
  logIn: (data: SignInAuth) => Promise<any>;
  logOut: () => Promise<any>;
}>({
  user: null,
  token: null,
  loading: false,
  setLoading: (value) => value,
  tokenExpiry: 0,
  registerUser: async () => {},
  logIn: async () => {},
  logOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth cannot be used outside AuthProvider");
  return context;
};