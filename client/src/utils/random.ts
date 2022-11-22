import { COLORS } from "../@types/colors";

export function generateRandomPastelColors(count = 1) {
  const colors = Object.keys(COLORS);
  const picked: (keyof typeof COLORS)[] = [];

  const picker = () => {
    if (picked.length === count) return;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    if (!picked.find((p) => p === randomColor)) picked.push(randomColor as keyof typeof COLORS);
    picker();
  };
  picker();

  return picked;
}
