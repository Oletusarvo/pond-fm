import { X } from "lucide-react";
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
      "w-full flex h-full z-90 bg-black/20 backdrop-blur-lg absolute top-0 left-0 text-black",
      !fullScreen ? "items-center justify-center p-2" : "",
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
      "bg-white p-4 flex flex-col max-h-full animate-fade-in animate-grow-in min-h-32",
      fullScreen ? "w-full h-full" : "xs:w-full md:w-[60%] lg:w-[50%] xl:w-[40%] rounded-md",
      fullHeight ? "h-full" : "h-auto",
    );
    return (
      <div className={className} ref={ref as React.Ref<HTMLDivElement>} onClick={stopPropagation()}>
        <div className='flex items-center w-full justify-between pb-4'>
          <h3 className='font-semibold text-slate-500'>{title}</h3>
          <Button hidden={!onClose} paddingEnabled onClick={onClick} variant='ghost' shape='circle'>
            <X />
          </Button>
        </div>
        <div className='py-4 overflow-y-scroll scrollable'>{children}</div>
      </div>
    );
  });

  return <Container />;
});
