"use client";

import { create } from "zustand";

type OrderStoreState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useOrderStore = create<OrderStoreState>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value })
}));
