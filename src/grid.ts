export type Grid = (string | null)[][];

export const animals = [
  "🦠", "🪱", "🐜", "🦟", "🪰", "🐝", "🐞", "🪲", "🦗", "🪳", "🕷️", "🐌", "🦂", "🦋",
  "🐟", "🐠", "🐡", "🦎", "🐍", "🐸", "🐢", "🐙", "🦤", "🦔", "🐭", "🐹", "🐀", "🐰",
  "🐿️", "🦇", "🦫", "🦥", "🦦", "🦨", "🐨", "🦡", "🐦", "🕊️", "🦃", "🐔", "🐓",
  "🐧", "🦆", "🦢", "🦜", "🦉", "🦩", "🦅", "🦚", "🦭", "🦈", "🐬", "🐊", "🐫", "🦙",
  "🦘", "🐼", "🐻", "🐻‍❄️", "🦒", "🦛", "🦏", "🐘", "🐋", "🦣", "🦕", "🐉", "🦄"
];


// Create an empty 10x10 grid
export function createGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}