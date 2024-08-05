import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { LoginSchema, JWTToken, loginFn, handleError } from "@/api/user";

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
