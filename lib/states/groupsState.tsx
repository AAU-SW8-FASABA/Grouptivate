import { createContext, useContext, useState, ReactNode } from "react";
import { Group } from "../API/schemas/Group";

// Define the initial user state
export const initialGroup: Map<string, Group> = new Map();

type groupsContextType = {
  contextGroups: Map<string, Group>;
  setGroups: (groups: Map<string, Group>) => void;
};

export const GroupsContext = createContext<groupsContextType>({
  contextGroups: initialGroup,
  setGroups: () => {},
});

export const GroupsProvide = ({ children }: { children: ReactNode }) => {
  const [contextGroups, setGroups] = useState<Map<string, Group>>(initialGroup);
  return (
    <GroupsContext.Provider value={{ contextGroups, setGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => useContext(GroupsContext);
