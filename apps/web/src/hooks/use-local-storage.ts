import { useEffect, useMemo, useState } from "react";
import { joinStrings } from "../utils/join-strings";

type TValue = string | number | (string | number)[];

/**Manages a state whose value is saved into local storage by the provided key on updates. */
export function useLocalStorageState(key: string[], initialValue?: TValue) {
  const itemKey = useMemo(() => joinStrings(key), [key]);
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(itemKey);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (err) {
        //Not parseable as json; return value as is.
        return storedValue;
      }
    }
    //Stored value not parseable as json or is undefined; return the initial value.
    return initialValue;
  });

  const setState = (state: TValue | ((prev: TValue) => TValue)) => {
    const newValue = typeof state === "function" ? state(value) : state;
    setValue(newValue);
    const valueToStore = JSON.stringify(newValue);
    localStorage.setItem(itemKey, valueToStore);
  };

  return {
    value,
    setState: setState,
  };
}
