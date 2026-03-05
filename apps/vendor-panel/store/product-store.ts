"use client";

import { create } from "zustand";

type ProductStoreState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useProductStore = create<ProductStoreState>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value })
}));
