export const randomNumber = (lower: number, upper: number): number =>
  Math.floor(Math.random() * (upper - lower + 1)) + lower;

export function getRandomEmoji(): string {
  const emojis = [":)", ":D", ":P", ":3"] as const;
  return emojis[randomNumber(0, emojis.length - 1)];
}
