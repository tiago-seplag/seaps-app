"use client";
import React, { createContext, useContext, ReactNode } from "react";
import {
  Checklist,
  ChecklistItems,
  Organization,
  Person,
  Property,
  User,
} from "@prisma/client";

type ChecklistType = Checklist & {
  property: Property & {
    organization: Organization;
    person: Person | null;
  };
  organization: Organization;
  user: Omit<User, "password"> | null;
};

type ChecklistItemType = ChecklistItems & {
  item: {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    is_deleted: boolean;
    level: number;
  };
};

interface ChecklistContextType {
  checklist: ChecklistType | null;
  checklistItems: ChecklistItemType[] | null;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(
  undefined,
);

interface ChecklistProviderProps {
  children: ReactNode;
  checklistItems: ChecklistItemType[];
  checklist: ChecklistType;
}

const ChecklistProvider: React.FC<ChecklistProviderProps> = ({
  children,
  checklist,
  checklistItems,
}) => {
  return (
    <ChecklistContext.Provider value={{ checklist, checklistItems }}>
      {children}
    </ChecklistContext.Provider>
  );
};

// Create a custom hook to use the context
const useChecklist = (): ChecklistContextType => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within a UserProvider");
  }
  return context;
};

export { ChecklistProvider, useChecklist };
