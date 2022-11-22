export const COLORS = {
  BROWN200: "#C19195",
  BROWN100: "#D5B5B2",
  BROWN50: "#FBF3E5",
  BROWN0: "#D9EBE1",
  GREY100: "#B1B1B3",
  GREY50: "#A4CCCA",
  SKY400: "#6bcbcb",
  SKY300: "#92EBE7",
  SKY200: "#B5EBE7",
} as const;

export type COLORS = typeof COLORS[keyof typeof COLORS];
