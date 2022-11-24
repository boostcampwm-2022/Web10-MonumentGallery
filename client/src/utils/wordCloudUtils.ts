import { IKeywordMap } from "../@types/gallery";

export interface IWordPointData {
  text: string;
  size: number;
  fontSize: number;
}

export function makeWordsPointData(words: IKeywordMap): IWordPointData[] {
  const entries: [keyword: string, freq: number][] = Object.entries(words);
  const biggestFrequency = entries.reduce((max: number, [, value]) => Math.max(max, value), 0);
  const biggestfontSize = 1;
  const result = [];
  for (const [text, freq] of entries) {
    const fontSize = (biggestfontSize * freq) / biggestFrequency;
    const size = (text.length * fontSize) / 10;
    result.push({ text, size, fontSize });
  }
  result.sort((a, b) => b.size - a.size);
  return result.slice(0, 30);
}

function _getDistributeIndex(index: number) {
  const logIndex = Math.floor(Math.log2(index));
  const min2PowIndex = 2 ** logIndex;

  const result = (index - min2PowIndex) / min2PowIndex + 1 / (min2PowIndex * 2);

  if (logIndex % 2) return result;
  return 1 - result;
}

export function getDistributeIndex(index: number) {
  if (index === 0) return 0;
  if (index === 1) return 1;
  if (index === 2) return 0.5;
  return _getDistributeIndex(index - 1);
}

export function getCircluarDistributeIndex(index: number) {
  if (index === 0) return 0;
  if (index === 1) return 0.5;
  return _getDistributeIndex(index - 2);
}
