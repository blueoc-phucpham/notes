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
import { RequireAuth } from "./components/mine/RequireAuth";
import AuthProvider from "./providers/authProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="/me"
                element={
                  <RequireAuth>
                    <Profile />
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
      </AuthProvider>
    </QueryClientProvider>
  );
}
