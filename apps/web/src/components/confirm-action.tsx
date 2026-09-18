import { ReactNode, useState } from "react";
import { useClassName } from "../hooks/use-class-name";
import { AlertCircle, CircleAlert, InfoIcon, TriangleAlert } from "lucide-react";
import { Button, LoaderButton } from "./button";
import { PassProps } from "./pass-props";
import { useDetectClickOutside } from "../hooks/use-detect-click-outside";

const colors = {
  default: {
    text: "text-inherit",
    dialog: "border border-slate-200",
    icon: "text-slate-500",
  },
  danger: {
    text: "text-red-800",
    dialog: "border border-red-200 bg-red-50",
    icon: "text-red-500",
  },
  warning: {
    text: "text-yellow-800",
    dialog: "border border-yellow-200 bg-yellow-50",
    icon: "text-yellow-500",
  },
  "danger.outlined": {
    text: "text-slate-700",
    dialog: "border border-red-200 bg-slate-50",
    icon: "text-red-500",
  },
  "warning.outlined": {
    text: "text-slate-700",
    dialog: "border border-yellow-200 bg-slate-50",
    icon: "text-yellow-500",
  },
} as const;

const icons: Record<keyof typeof colors, React.FC<any>> = {
  default: InfoIcon,
  danger: TriangleAlert,
  warning: CircleAlert,
  "danger.outlined": TriangleAlert,
  "warning.outlined": CircleAlert,
} as const;

type ConfirmActionProps = React.PropsWithChildren & {
  variant: keyof typeof colors;
  /**The element triggering the confirmation dialog. */
  intentButton: ReactNode;
  /**The element canceling the confirmation dialog. */
  intentCancelButton?: ReactNode;
  /**The element confirming the dialog. */
  confirmButton?: ReactNode;
  /**The method to run on confirmation. */
  onConfirm?: () => void | Promise<void>;
};

export function ConfirmAction({
  children,
  variant = "default",
  intentButton,
  intentCancelButton = <Button variant='text'>Cancel</Button>,
  confirmButton = <Button variant='text'>Confirm</Button>,
  onConfirm,
}: ConfirmActionProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { ref } = useDetectClickOutside({
    onClickOutside: () => setIsConfirming(false),
  });
  const dialogContainerClassName = useClassName(
    "flex flex-col items-end rounded-md border p-2 gap-2 w-full",
    colors[variant].dialog,
  );

  const dialogIconClassName = useClassName("text-sm shrink-0", colors[variant].icon);
  const iconContainerClassName = useClassName(
    "rounded-full w-8 h-8 flex items-center justify-center shrink-0",
    variant === "danger"
      ? "bg-red-500/20"
      : variant === "warning"
        ? "bg-yellow-500/20"
        : "bg-gray-500/20",
  );
  const buttonColor = variant === "default" ? "inherit" : variant;
  const Icon = icons[variant];
  return isConfirming ? (
    <div className={dialogContainerClassName} ref={ref as unknown as React.Ref<HTMLDivElement>}>
      <div className='flex gap-2 w-full items-center text-sm'>
        <div className={iconContainerClassName}>
          <Icon className={dialogIconClassName} size='1rem' />
        </div>
        <span>{children}</span>
      </div>
      <div className='flex gap-2 items-center'>
        <PassProps onClick={() => setIsConfirming(false)}>{intentCancelButton}</PassProps>
        <PassProps onClick={onConfirm}>{confirmButton}</PassProps>
      </div>
    </div>
  ) : (
    <PassProps onClick={() => setIsConfirming(true)}>{intentButton}</PassProps>
  );
}
