import { verify } from "jsonwebtoken";
import { COLORS } from "../@types/colors";
import POSITION from "./randomPosition.json";

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

const position = POSITION.position as [number, number][];

export function generateRandomPosition(count = 1) {
  const picked: [number, number][] = [];

  const picker = () => {
    if (picked.length === count) return;
    const randomPosition: [number, number] = position[Math.floor(Math.random() * position.length)];
    if (!picked.find((p) => p === randomPosition)) picked.push(randomPosition);
    picker();
  };
  picker();
  return picked;
}
