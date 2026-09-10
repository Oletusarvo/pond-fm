import React from "react";
import { withLoader } from "../hoc/with-alternate";
import { useClassName } from "../hooks/use-class-name";
import type { WithoutClassName } from "../utils/without-class-name";

const colors = {
  primary: {
    contained: "bg-primary text-white",
    outlined: "border-primary text-primary",
    ghost: "text-primary hover:bg-primary/10",
    text: "text-primary",
  },
  danger: {
    contained: "bg-red-500 text-white",
    outlined: "border-red-500 text-red-500",
    ghost: "text-red-500 hover:bg-red-500/20",
    text: "text-red-500",
  },
  warning: {
    contained: "bg-yellow-500 text-white",
    outlined: "border-yellow-500 text-yellow-500",
    ghost: "text-yellow-500 hover:bg-yellow-500/20",
    text: "text-yellow-500",
  },
  white: {
    ghost: "text-white hover:bg-slate-500/10",
  },
} as const;

type ButtonProps = WithoutClassName<React.ComponentProps<"button">> & {
  variant?: keyof (typeof colors)["primary"];
  shadow?: boolean;
  fullWidth?: boolean;
  paddingEnabled?: boolean;
  shape?: "default" | "rounded" | "circle";
  color?: keyof typeof colors | "inherit";
  icon?: React.FC<any>;
};

export function Button({
  children,
  shape = "default",
  shadow,
  fullWidth,
  paddingEnabled,
  variant = "contained",
  color = "primary",
  icon: Icon,
  ...props
}: ButtonProps) {
  const className = useClassName(
    "flex text-sm items-center justify-center active:scale-95 cursor-pointer transition-all duration-100 font-semibold gap-2 border text-nowrap flex-nowrap",
    color !== "inherit" ? colors[color][variant] : "",
    ["ghost", "text", "contained"].includes(variant)
      ? "border-transparent"
      : "",
    shadow ? "shadow-md" : "",
    shape === "circle"
      ? "rounded-full min-w-4 min-h-4 aspect-square"
      : shape === "rounded"
        ? "rounded-md"
        : "",
    fullWidth ? "w-full" : "",
    paddingEnabled ? (variant !== "ghost" ? "py-2 px-4" : "p-2") : "",
  );
  return (
    <button {...props} type={props.type || "button"} className={className}>
      {Icon ? <Icon size='1rem' /> : null}
      <span>{children}</span>
    </button>
  );
}

export const LoaderButton = withLoader(Button);
