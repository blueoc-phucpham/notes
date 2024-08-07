import { Routes, Route } from "react-router-dom";
import "@/styles/global.css";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  NonAuthenticateUserOnly,
  RequireAdmin,
  RequireAuth,
} from "./components/mine/RequireAuth";
import Logout from "./pages/Logout";
import EmailVerified from "./pages/EmailVerified";
import RolePage from "./admin/RolePage";
import AuthLayout from "./layout/AuthLayout";
import Shared from "./pages/Shared";
import AssignPermission from "./pages/AssignPermission";
import CheckEmail from "./pages/CheckEmail";

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
              path="/shared"
              element={
                <RequireAuth>
                  <Shared />
                </RequireAuth>
              }
            />
            <Route
              path="/check-email/"
              element={<CheckEmail />}
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

          <Route path="/admin" element={<Layout></Layout>}>
            <Route
              path="/admin/roles"
              element={
                <RequireAdmin>
                  <RolePage></RolePage>
                </RequireAdmin>
              }
            ></Route>
            <Route
              path="/admin/permissions"
              element={
                <RequireAdmin>
                  <AssignPermission></AssignPermission>
                </RequireAdmin>
              }
            ></Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
