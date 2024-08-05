import { API, Base, User } from "./user";

export type Note = Base & {
  id: number;
  title: string | null;
  content: string | null;
  version: number;
  author: User;
};

export type NoteUpdate = { id: number } & Pick<Note, "title" | "content">;

export const getNotesFn = async (): Promise<Note[]> => {
  const response = await API.get("/notes/");

  return response.data;
};

export const updateNoteFn = async (
  values: NoteUpdate
): Promise<Note[]> => {
  const response = await API.put(`/notes/${values.id}/`, values);

  return response.data;
};
