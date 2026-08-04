import { useState } from "react";

type useToggleProps<T> = {
  initialItems?: T[];
  limit?: number;
  onChanged?: (items: T[]) => void;
}
export function useToggleList<T>({
  initialItems,
  limit,
  onChanged
}: useToggleProps<T> = {}) {
  const [items, setItems] = useState<T[]>(initialItems || []);
  const toggleItem = (item: T) => {
    const newItems = items.includes(item) ? items.filter(i => i !== item) : (
      limit && items.length + 1 > limit ? items : [...items, item]
    );

    setItems(newItems);
    onChanged?.(newItems);
  }

  return {
    items, toggleItem,
  }
}