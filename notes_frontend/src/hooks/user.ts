import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import {
  LoginSchema,
  JWTToken,
  loginFn,
  handleError,
  SignUpSchema,
  User,
  signUpFn,
} from "@/api/user";
import { useState } from "react";

export type SignUpValidationError = {
    [key in keyof User]: string[];
};

export const useLoginMutation = () => {
  return useMutation<JWTToken, AxiosError, LoginSchema>({
    mutationFn: handleError(loginFn),
    onSuccess: (data) => {
      console.log("Login successful", data);
    },
    onError: (error: AxiosError) => {
      console.error(error);
    },
  });
};

export const useSignUpMutation = () => {
    const [error, setError] = useState<SignUpValidationError | null>(null);
  
    const mutation = useMutation<User, AxiosError<SignUpValidationError>, SignUpSchema>({
      mutationFn: signUpFn,
      onSuccess: (data) => {
        console.log("Sign up successful", data);
        setError(null);
      },
      onError: (error: Error) => {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data as SignUpValidationError);
        }
      },
    });
  
    return { mutation, error };
  };
