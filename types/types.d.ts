export * from './components';
export * from './session';
export * from './events';
export * from './options';
export * from './config';
export * from './page';
export { SPX } from './global';
export { Merge, LiteralUnion, ValueOf } from 'type-fest';
export type Identity<T> = T;
export type Match<T, U> = [T[keyof T]] extends [U[keyof U]] ? [U[keyof U]] extends [T[keyof T]] ? true : false : false;
export type Attrs = { [key: string]: unknown; }
