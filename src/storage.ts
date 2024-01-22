const STORAGE_KEY = "users";

export interface UserData {
  id: string | number;
  name: string;
  password: number;
  shift?: string[];
}

export const getUsers = () => {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json === null) {
    return null;
  }
  return JSON.parse(json) as UserData[];
};

export const setUsers = (users: UserData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};
