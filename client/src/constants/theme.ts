export const THEME = {
  DREAM: "DREAM",
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  AUTUMN: "AUTUMN",
  WINTER: "WINTER",
} as const;
export type THEME = typeof THEME[keyof typeof THEME];
