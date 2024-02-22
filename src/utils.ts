export const insideOfRange = (value: number, range: Array<number>) => {
  if (value >= range[0] && value <= range[1]) return true;
  else return false;
};

export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
