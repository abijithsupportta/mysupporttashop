"use client";

import { create } from "zustand";

type StoreStoreState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useStoreStore = create<StoreStoreState>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value })
}));
