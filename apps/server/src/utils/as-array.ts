export function asArray(value?: string | string[]) {
  return value ? Array.isArray(value) ? value : [value] : null;
}