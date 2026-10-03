import { Check, Info, TriangleAlert, X } from "lucide-react";
import { useClassName } from "../hooks/use-class-name";
import { IconContainer } from "./icon";

type HelperMessageProps = React.PropsWithChildren & {
  type?: "success" | "error" | "warning";
  fullWidth?: boolean;
};

export function HelperMessage({ children, type, fullWidth }: HelperMessageProps) {
  const Icon =
    type === "success" ? Check : type === "error" ? X : type === "warning" ? TriangleAlert : Info;
  const containerClassName = useClassName(
    "flex items-center py-2 px-4 gap-4 border rounded-md text-sm",
    fullWidth ? "w-full" : "",
    type === "success"
      ? "text-green-600 bg-green-100 border-green-200"
      : type === "error"
        ? "text-red-600 bg-red-100 border-red-200"
        : type === "warning"
          ? "text-yellow-700 bg-yellow-100 border-yellow-200"
          : "text-slate-700 bg-slate-100 border-slate-200",
  );

  return (
    <div className={containerClassName}>
      {Icon ? (
        <IconContainer variant={type === "error" ? "danger" : type}>
          <Icon size='1rem' />{" "}
        </IconContainer>
      ) : null}

      <span>{children}</span>
    </div>
  );
}

export function ErrorMessage({ children }: React.PropsWithChildren) {
  return <HelperMessage type='error'>{children}</HelperMessage>;
}

export function SuccessMessage({ children }: React.PropsWithChildren) {
  return <HelperMessage type='success'>{children}</HelperMessage>;
}

export function WarningMessage({ children }: React.PropsWithChildren) {
  return <HelperMessage type='warning'>{children}</HelperMessage>;
}
