import axios from "axios";

const url = "http://127.0.0.1:8000/";

export const API = axios.create({
  baseURL: url,
});

export type LoginSchema = {
  username: string;
  password: string;
};

export type JWTToken = {
  access: string;
  refresh: string;
};

export type SignUpSchema = {
  username: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type APIError = {
  detail: string;
};



export function handleError<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => Promise<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any[]) => Promise<T> {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error((error.response.data as APIError).detail);
      }
      throw new Error("An unexpected error occurred");
    }
  };
}

export const loginFn = async (payload: LoginSchema) => {
  const response = await API.post<JWTToken>("/users/login/", payload);

  return response.data;
};

export const loginRefreshFn = async (payload: Pick<JWTToken, "refresh">) => {
  const response = await API.post<Pick<JWTToken, "access">>(
    "/users/login",
    payload
  );

  return response.data;
};

export const signUpFn = async (payload: SignUpSchema): Promise<User> => {
  const response = await API.post("/users/sign-up/", payload);

  return response.data;
};

export const profileFn = async () => {
  const response = await API.get("/users/me/");

  return response.data;
};
