import { useState } from "react";

type UseToggleProps = {
  initialValue?: boolean;
  onChange?: (newState?: boolean) => void;
};

/**Provides functionality for toggling a boolean value. */
export function useToggle({ initialValue, onChange }: UseToggleProps) {
  const [value, setValue] = useState(initialValue || false);
  const toggle = (state?: boolean) => {
    const newValue = typeof state !== "undefined" ? state : !value;
    setValue(newValue);
    onChange?.(newValue);
  };
  return { value, toggle };
}
