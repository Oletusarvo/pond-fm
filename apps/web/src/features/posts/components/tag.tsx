import { useState } from "react";
import { useClassName } from "../../../hooks/use-class-name";
import { useStopPropagation } from "../../../hooks/use-stop-propagation";

type TagProps = {
  value: string;
  onSelected?: (tag: string) => void;
  selected?: boolean;
  color?: "primary" | "secondary";
  size?: "default" | "small";
};

const colorMap: Record<TagProps["color"], Record<"selected" | "unselected", string>> = {
  primary: {
    selected: "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
    unselected:
      "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700",
  },
  secondary: {
    selected: "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/15",
    unselected:
      "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-800",
  },
};

export function Tag({ value, onSelected, selected, color = "primary", size }: TagProps) {
  const colorConfig = colorMap[color];
  const className = useClassName(
    "rounded-full border font-semibold text-center shrink-0 select-none transition-all duration-150",
    size === "small"
      ? "px-2.5 py-1 text-[10px] leading-none"
      : "px-3 py-1.5 text-[11px] leading-none",
    onSelected ? "cursor-pointer" : "cursor-default",
    selected ? colorConfig.selected : colorConfig.unselected,
  );

  const onClick = useStopPropagation((e) => onSelected?.(value));

  return (
    <div onClick={onClick} className={className}>
      {value}
    </div>
  );
}
