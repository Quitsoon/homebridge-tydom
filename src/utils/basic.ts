import {xor} from 'lodash';

export const stringIncludes = (array: unknown[], value: string | number): boolean =>
  array.includes(value) || array.includes(`${value}`);

export const sameArrays = (source: unknown[], array: unknown[]): boolean =>
  source.length === array.length && xor(source, array).length === 0;

export const asNumber = (maybeNumber: unknown): number => parseInt(`${maybeNumber}`, 10);

const timeouts = new Map<string, {timeout: NodeJS.Timeout; reject: () => void}>();
export const waitFor = async (key: string, ms: number): Promise<void> => {
  if (timeouts.has(key)) {
    const {timeout, reject} = timeouts.get(key)!;
    clearTimeout(timeout);
    timeouts.delete(key);
    reject();
  }
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    timeouts.set(key, {timeout, reject});
  });
  timeouts.delete(key);
};
