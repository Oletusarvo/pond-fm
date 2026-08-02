import { X } from 'lucide-react';
import { Button } from './button';
import { useClassName } from '../hooks/use-class-name';
import React from 'react';

type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  title: string;
  fullScreen?: boolean;
};

export const Modal = React.memo(function Modal({
  children,
  onClose,
  title,
  fullScreen,
}: ModalProps) {
  function Container() {
    const className = useClassName(
      'w-full flex h-full z-90 bg-black/20 backdrop-blur-lg absolute top-0 left-0',
      !fullScreen ? 'items-center justify-center p-2' : '',
    );
    return (
      <div className={className}>
        <Body />
      </div>
    );
  }

  const Body = React.memo(function Body() {
    const className = useClassName(
      'bg-white p-4 flex flex-col overflow-y-scroll max-h-full',
      fullScreen ? 'w-full h-full' : 'xs:w-full md:w-[50%] lg:w-[30%] xl:min-w-[40%] rounded-md',
    );
    return (
      <div className={className}>
        <div className='flex items-center w-full justify-between pt-2 pb-4 text-slate-500'>
          <h3 className='font-semibold'>{title}</h3>
          <Button
            paddingEnabled
            onClick={onClose}
            variant='ghost'
            shape='circle'>
            <X />
          </Button>
        </div>
        <div className='flex flex-col overflow-hidden overflow-y-scroll py-4'>{children}</div>
      </div>
    );
  });

  return <Container />;
});
