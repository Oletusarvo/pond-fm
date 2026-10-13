import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { useClassName } from "../hooks/use-class-name";
import React from "react";
import { useDetectClickOutside } from "../hooks/use-detect-click-outside";
import { useStopPropagation } from "../hooks/use-stop-propagation";
import { stopPropagation } from "../utils/stop-propagation";

type ModalProps = React.PropsWithChildren & {
  onClose?: () => void;
  title: string;
  fullScreen?: boolean;
  fullHeight?: boolean;
};

export const Modal = React.memo(function Modal({
  children,
  onClose,
  title,
  fullScreen,
  fullHeight,
}: ModalProps) {
  function Container() {
    const className = useClassName(
      "fixed inset-0 z-90 flex h-full bg-slate-950/40 text-slate-900 backdrop-blur-sm",
      !fullScreen ? "items-center justify-center p-3 sm:p-6" : "",
    );
    return (
      <div className={className}>
        <Body />
      </div>
    );
  }

  const Body = React.memo(function Body() {
    const onClick = useStopPropagation(() => onClose?.());
    const { ref } = useDetectClickOutside({
      onClickOutside: onClick,
    });
    const className = useClassName(
      "flex min-h-32 max-h-full flex-col border border-emerald-100 bg-white p-5 shadow-2xl shadow-slate-950/15 animate-fade-in animate-grow-in sm:p-7",
      fullScreen ? "h-full w-full rounded-none" : "w-full max-w-3xl rounded-2xl",
      fullHeight ? "h-full" : "h-auto",
    );
    return (
      <div className={className} ref={ref as React.Ref<HTMLDivElement>} onClick={stopPropagation()}>
        <div className='flex w-full items-center justify-between gap-4 border-b border-slate-100 pb-4'>
          <h3 className='text-lg font-bold text-slate-900'>{title}</h3>
          <Button hidden={!onClose} paddingEnabled onClick={onClick} variant='ghost' shape='circle'>
            <X />
          </Button>
        </div>
        <div className='min-h-0 flex-1 overflow-y-auto py-5 scrollable'>{children}</div>
      </div>
    );
  });

  return createPortal(<Container />, document.body);
});
