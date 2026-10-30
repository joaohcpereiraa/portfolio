import { create } from "zustand";

const useNetworkStore = create((set) => ({
  isOnline: true,
  toggleWifi: () => set((s) => ({ isOnline: !s.isOnline })),
}));

export default useNetworkStore;
