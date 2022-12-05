import axios, { AxiosResponse } from "axios";
import create from "zustand";
import { select } from "./select";

interface TestStore {
  data: string;
  getTest: () => string;
  setData: (data: string) => void;
}

export const testSelector = () =>
  select<AxiosResponse<string>>({
    key: "test",
    get: () => axios({ method: "get", url: `/test/gallery/12/123` }),
  });

const testStore = create<TestStore>((set) => ({
  data: "no data",
  getTest: () => testSelector().data,
  setData: (newData) => set(() => ({ data: newData })),
}));

export default testStore;
