import axios from "axios";
import { PeriodType, ThemeType } from "../../components/SpaceCreater";

export function fetchData(period: PeriodType | null, theme: ThemeType | null) {
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
