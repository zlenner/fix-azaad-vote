export interface User {
  // ...should have something
}

export type Mongoize<T> = T & {
  _id: string
}
