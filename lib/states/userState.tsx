import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/lib/API/schemas/User";
import { SetupActivitySync } from "../ActivitySync";

// Define the initial user state
export const initialUser: User = {
  userId: "",
  name: "",
  groups: [],
  goals: [],
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    if (user.userId === "") return;

    SetupActivitySync();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
