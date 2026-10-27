import ms, { StringValue } from 'ms';

/**
 * Parse time in 1d 5m 30m to seconds
 */
export function parseToSeconds(time: string | number) {
  if (typeof time === 'string') {
    return Math.floor(ms(time as StringValue) / 1000);
  }

  return time;
}
