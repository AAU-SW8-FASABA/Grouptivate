import { createContext, useContext, useState, ReactNode } from "react";
import { Group } from "../API/schemas/Group";

export type ContextGroups = Map<string, Group>;

// Define the initial user state
export const initialGroups: ContextGroups = new Map();

type groupsContextType = {
  contextGroups: ContextGroups;
  setContextGroups: (groups: ContextGroups) => void;
};

export const GroupsContext = createContext<groupsContextType>({
  contextGroups: initialGroups,
  setContextGroups: () => {},
});

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const [contextGroups, setContextGroups] =
    useState<ContextGroups>(initialGroups);
  return (
    <GroupsContext.Provider value={{ contextGroups, setContextGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => useContext(GroupsContext);
