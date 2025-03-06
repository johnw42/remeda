export type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;

// type LazyEmpty = {
//   done: boolean;
//   hasNext: false;
//   hasMany?: false | undefined;
//   next?: undefined;
// };

// type LazyNext<T> = {
//   done: boolean;
//   hasNext: true;
//   hasMany?: false | undefined;
//   next: T;
// };

// type LazyMany<T> = {
//   done: boolean;
//   hasNext: true;
//   hasMany: true;
//   next: ReadonlyArray<T>;
// };

export type LazyEmpty = IteratorReturnResult<readonly []>;
export type LazyNext<T> = IteratorYieldResult<readonly [T]>;
export type LazyMany<T> = IteratorYieldResult<ReadonlyArray<T>>;
