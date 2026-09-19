import { useClassName } from "../hooks/use-class-name";

export function IconContainer({
  children,
  variant,
}: React.PropsWithChildren & { variant: "danger" | "warning" | "default" | "success" }) {
  const iconContainerClassName = useClassName(
    "rounded-full w-8 h-8 flex items-center justify-center shrink-0",
    variant === "danger"
      ? "bg-red-500/20"
      : variant === "warning"
        ? "bg-yellow-500/20"
        : variant === "success"
          ? "bg-green-500/20"
          : "bg-gray-500/20",
  );
  return <div className={iconContainerClassName}>{children}</div>;
}
