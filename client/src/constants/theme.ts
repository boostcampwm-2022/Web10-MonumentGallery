import { ThemeType } from "../@types/gallery";

export const THEME = {
  DREAM: "DREAM",
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  AUTUMN: "AUTUMN",
  WINTER: "WINTER",
} as const;

export const THEME_ITEM_LIST: { value: ThemeType; text: string; style: string }[] = [
  { value: THEME.DREAM, text: "꿈", style: "dream" },
  { value: THEME.SPRING, text: "봄", style: "spring" },
  { value: THEME.SUMMER, text: "여름", style: "summer" },
  { value: THEME.AUTUMN, text: "가을", style: "autumn" },
  { value: THEME.WINTER, text: "겨울", style: "winter" },
];
