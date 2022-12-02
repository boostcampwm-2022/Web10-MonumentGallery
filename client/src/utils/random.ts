import { COLORS } from "../@types/colors";
import POSITION from "./randomPosition.json";

const position = POSITION.position as [number, number][];

function generateRandomPick<Item>(array: Item[], count = 1): Item[] {
  const picked: Item[] = [];
  (function picker() {
    if (picked.length === count || picked.length >= array.length) return;
    const pickedValue = array[Math.floor(Math.random() * array.length)];
    if (!picked.includes(pickedValue)) picked.push(pickedValue);
    picker();
  })();

  return picked;
}

export function generateRandomPastelColors(count = 1) {
  const colors = Object.keys(COLORS);
  return generateRandomPick<keyof typeof COLORS>(colors as (keyof typeof COLORS)[], count);
}

export function generateRandomPosition(count = 1) {
  return generateRandomPick<[number, number]>(position, count);
}
