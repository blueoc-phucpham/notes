import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import "@/styles/global.css";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layout/AuthLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { fakeAuthProvider } from "@/services/auth";
import Protected from "./pages/Protected";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <AuthStatus></AuthStatus>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <Protected />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

type User = {
  username: string;
};

interface AuthContextType {
  user: User;
  signin: (user: User, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: { username: "" },
  signin: () => {
    undefined;
  },
  signout: () => {
    undefined;
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>({ username: "" });

  const signin = (newUser: User, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser({ username: "" });
      callback();
    });
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user.username}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user.username) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
