import { Link } from "@remix-run/react";
import * as React from "react";
import { UserAuthForm } from "~/components/auth/AuthForm";



export default function Login() {
  return (
    <div className="h-full flex self-center justify-center flex-col">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Access your personal notes
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill out your account below to see your ideas
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
