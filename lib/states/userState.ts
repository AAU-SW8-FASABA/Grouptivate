import { createContext } from "react";
import { User } from "@/lib/API/schemas/User";

export const initialUser: User = {
  userId: "",
  name: "",
  groups: [],
  goals: [],
};
export const UserContext = createContext(initialUser);
