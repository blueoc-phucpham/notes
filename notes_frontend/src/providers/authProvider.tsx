import { AuthContext, User } from "@/hooks/auth";
import React from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User | null>(null);

  const login = async (username: string, password: string) => {

    



    setUser({ username: "ppvan" });
    throw new Error("invalid credentials");
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
