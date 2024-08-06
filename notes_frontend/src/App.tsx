import { Routes, Route } from "react-router-dom";
import "@/styles/global.css";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layout/AuthLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./pages/Profile";
import {
  NonAuthenticateUserOnly,
  RequireAuth,
} from "./components/mine/RequireAuth";
import Logout from "./pages/Logout";
import EmailVerified from "./pages/EmailVerified";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/me"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/email-verification/:token"
              element={<EmailVerified />}
            />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route
              path="/auth/login"
              element={
                <NonAuthenticateUserOnly>
                  <Login />
                </NonAuthenticateUserOnly>
              }
            />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route
              path="/auth/email-verification/:token"
              element={<EmailVerified />}
            />
            <Route path="/auth/logout" element={<Logout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
