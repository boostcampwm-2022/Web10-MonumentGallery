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

export const CENTER_ISLAND_COLORS = {
  DREAM: "#56488A",
  SPRING: "#F294AD",
  SUMMER: "#025940",
  AUTUMN: "#732002",
  WINTER: "#24ADAF",
};

export const ISLAND_COLORS = {
  DREAM: "#766BBF",
  SPRING: "#F294AD",
  SUMMER: "#025940",
  AUTUMN: "#BD4413",
  WINTER: "#24ADAF",
};

export const BRIDGE_COLORS = {
  DREAM: "#442563",
  SPRING: "#D9488B",
  SUMMER: "#03A64A",
  AUTUMN: "#F28D35",
  WINTER: "#FFFFFF",
};

export const BACKGROUND_COLORS = {
  DREAM: "#F2D5DD",
  SPRING: "#F2DCEB",
  SUMMER: "#69D5FB",
  AUTUMN: "#A8E8FA",
  WINTER: "#D9D9D9",
};
