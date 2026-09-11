import { useEffect, useMemo, useState } from "react";
import { joinStrings } from "../utils/join-strings";

type TValue = string | number | (string | number)[];

export function useLocalStorage(key: string[], initialValue?: TValue) {
  const itemKey = useMemo(() => joinStrings(key), [key]);
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(itemKey);
    if (storedValue) {
      try {
        console.log("Attempting to parse as json...", storedValue);
        const parsedValue = JSON.parse(storedValue);
        console.log(typeof parsedValue, parsedValue);
        return parsedValue;
      } catch (err) {
        //Not parseable as json; return value as is.
        console.log("Not parseable as json; returning raw value.");
        return storedValue;
      }
    }
    //Stored value not parseable as json or defined; return the initial value.
    console.log(
      "No item stored for key " + itemKey + "; returning initial value.",
      initialValue,
    );
    return initialValue;
  });

  const updateLocalStorage = (value: TValue) => {
    setValue(value);
    const valueToStore = JSON.stringify(value);
    localStorage.setItem(itemKey, valueToStore);
  };

  return {
    value,
    updateLocalStorage,
  };
}
