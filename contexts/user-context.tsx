"use client";

import { $Enums } from "@prisma/client";
import React, { createContext, useContext, ReactNode } from "react";

// Define the context type
interface UserContextType {
  user: User | null;
}

// Define the user type
interface User {
  name: string;
  id: string;
  email: string;
  avatar: string | null;
  role: $Enums.ROLES;
  created_at: Date;
  updated_at: Date;
}

// Create the context with a default value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
  user: User | null;
}

const UserProvider: React.FC<UserProviderProps> = ({ children, user }) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

// Create a custom hook to use the context
const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
