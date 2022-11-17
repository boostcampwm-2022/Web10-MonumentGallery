import axios from "axios";

export function fetchData(period, theme) {
  let data: any[] | null = null;
  const suspender = axios.get("/test/getData", { params: { period, theme } }).then((res) => {
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
