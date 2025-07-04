import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      removeCurrentUser: () => set({ currentUser: null }),
      updateCurrentUser: (updatedUser) => set({ currentUser: updatedUser }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
