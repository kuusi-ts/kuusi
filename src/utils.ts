export const randomNumber = (lower: number, upper: number) =>
  Math.floor(Math.random() * (upper - lower + 1)) + lower;

export function getRandomEmoji(): string {
  const emojis = [":)", ":D", ":P", ":3"];
  return emojis[randomNumber(0, emojis.length - 1)];
}

export const returnStatus = (status: number) =>
  new Response(null, { status: status });
