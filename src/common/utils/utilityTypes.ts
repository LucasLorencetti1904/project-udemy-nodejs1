export type DeepPartial<T> =
  T extends Date ? T :
  T extends Function ? T :
  T extends Array<infer U> ? DeepPartial<U>[] :
  T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } :
  T;
