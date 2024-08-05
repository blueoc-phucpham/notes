import { API, Base, User } from "./user";

export type Note = Base & {
  id: number;
  title: string | null;
  content: string | null;
  version: number;
  author: User;
};

export const getNotesFn = async (): Promise<Note[]> => {
  const response = await API.get("/notes/");
  console.log(response);

  return response.data;
};
