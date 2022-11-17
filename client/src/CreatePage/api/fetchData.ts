import axios from "axios";

export function fetchData() {
  let data: any[] | null = null;
  const suspender = axios.get("/test/getData").then((res) => {
    data = res.data;
  });
  return {
    get() {
      if (data === null) {
        throw suspender;
      } else {
        return data;
      }
    },
  };
}
