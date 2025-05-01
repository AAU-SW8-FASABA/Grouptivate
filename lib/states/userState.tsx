import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/API/schemas/User";

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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
