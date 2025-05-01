import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/API/schemas/User";

// Define the initial user state
export const initialUser: User = {
  userId: "",
  name: "",
  groups: [],
  goals: [],
};

// Create a context type that includes both the user and a function to update it
type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {},
});

// Create a provider component that will wrap your app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to easily access the user context
export const useUser = () => useContext(UserContext);
