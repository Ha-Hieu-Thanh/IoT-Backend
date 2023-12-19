export function getUTCTimeNow(): number {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const utcTime = new Date(now.getTime() - offset * 60 * 1000);
  return utcTime.getTime();
}
