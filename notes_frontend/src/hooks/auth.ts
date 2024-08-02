import { createContext, useContext } from "react";

const noOp = () => {};

export type User = {
  username: string;
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: noOp,
});

export function useAuth() {
  return useContext(AuthContext);
}
