/**Omits the className-prop from its type argument. */
export type WithoutClassName<T> = Omit<T, 'className'>;
