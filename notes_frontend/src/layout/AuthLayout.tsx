import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-300 to-slate-100">
      <Outlet />
      <Toaster />
    </div>
  );
}
