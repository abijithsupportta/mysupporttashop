"use client";

import { create } from "zustand";

type AuthStoreState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value })
}));
