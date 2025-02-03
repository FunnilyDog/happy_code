import { create } from "zustand";

type TestStoreType = {
  bears: number;
  bearsAdd: (val: number) => void;
  removeAllBears: () => void;
};

const useTestStore = create<TestStoreType>((set, get) => ({
  bears: 0,
  bearsAdd: (val: number) => set((state) => ({ bears: state.bears + val })),
  removeAllBears: () => set({ bears: 0 })
}));

export default useTestStore;
