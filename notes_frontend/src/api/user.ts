import axios from "axios";


const server = import.meta.env.VITE_SERVER_URL ?? "http://127.0.0.1:8000"
const url = `${server}/api/v1`;

export const API = axios.create({
  baseURL: url,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await API.post("/users/refresh/", {
          refresh: refreshToken,
        });

        const { access: newAccessToken } = response.data;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect to login page or dispatch a logout action
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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

export type Base = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type User = Base & {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  password: string;
};

export type APIError = {
  detail: string;
};

export type AssignPermission = {
  role: number;
  user: number;
  note: number;
};

export type Permission = "view" | "edit" | "delete";

export type Role = Base & {
  id: number;
  label: string;
  permissions: Permission[];
};

export type RoleCreate = Pick<Role, "label" | "permissions">;
export type RoleUpdate = Pick<Role, "id" | "label" | "permissions">;

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

export const profileFn = async (): Promise<User> => {
  const response = await API.get("/users/me/");

  return response.data;
};

export const verifiedEmailFn = async (token: string) => {
  const response = await API.get(`/users/verify/${token}/`);

  return response.data;
};

export const userListFn = async (): Promise<
  Pick<User, "id" | "username">[]
> => {
  const response = await API.get("/users/search/");

  return response.data;
};

export const roleListFn = async (): Promise<Role[]> => {
  const response = await API.get("/users/roles/");

  return response.data;
};

export const roleCreateFn = async (values: RoleCreate): Promise<Role> => {
  const response = await API.post("/users/roles/", values);

  return response.data;
};

export const roleUpdateFn = async (values: RoleUpdate): Promise<Role> => {
  const response = await API.put(`/users/roles/${values.id}/`, values);

  return response.data;
};

export const roleDeleteFn = async (values: Role): Promise<Role> => {
  const response = await API.delete(`/users/roles/${values.id}/`);

  return response.data;
};

export const assignRoleFn = async (values: AssignPermission): Promise<AssignPermission> => {
  const response = await API.post(`/notes/assign-permission/`, values);

  return response.data;
};
