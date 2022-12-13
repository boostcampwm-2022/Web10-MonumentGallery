import { COLORS } from "../constants/colors";
import { POSITION } from "../constants/positions";

export type POSITION_KEY = keyof typeof POSITION;

function randInt(n: number): number {
  return Math.floor(Math.random() * n);
}

function generateRandomPick<Item>(array: Item[], count = 1): Item[] {
  const picked: Item[] = [];
  (function picker() {
    if (picked.length === count || picked.length >= array.length) return;
    const pickedValue = array[randInt(array.length)];
    if (!picked.includes(pickedValue)) picked.push(pickedValue);
    picker();
  })();

  return picked;
}

export function generateRandomPastelColor(): COLORS {
  const colors = Object.keys(COLORS);
  return COLORS[colors[randInt(colors.length)] as keyof typeof COLORS];
}

export function generateRandomPosition(type: POSITION_KEY, count = 1) {
  return generateRandomPick<[number, number]>(POSITION[type] as [number, number][], count);
}
