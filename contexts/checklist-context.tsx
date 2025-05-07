"use client";

import { Checklist } from "@prisma/client";
import React, { createContext, useContext, ReactNode } from "react";

type TChecklist = Checklist & {
  checklistItems: {
    id: string;
    score: number | null;
    created_at: Date;
    updated_at: Date;
    checklist_id: string;
    item_id: string;
    observation: string | null;
    image: string | null;
    is_inspected: boolean;
    item: {
      name: string;
      level: number;
    };
    images: {
      id: string;
      image: string;
      created_at: Date;
      checklist_item_id: string;
      observation: string | null;
    }[];
  }[];
};

// Define the context type
interface ChecklistContextType {
  checklist: TChecklist | null;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(
  undefined,
);

// Create a provider component
interface ChecklistProviderProps {
  children: ReactNode;
  checklist: TChecklist;
}

const ChecklistProvider: React.FC<ChecklistProviderProps> = ({
  children,
  checklist,
}) => {
  return (
    <ChecklistContext.Provider value={{ checklist }}>
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
