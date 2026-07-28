import { X } from 'lucide-react';
import { Button } from './button';
import { useClassName } from '../hooks/use-class-name';

type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  title: string;
  fullScreen?: boolean;
};

export function Modal({ children, onClose, title, fullScreen }: ModalProps) {
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

  function Body() {
    const className = useClassName(
      'bg-white p-4 flex flex-col animate-fade-in',
      fullScreen
        ? 'w-full h-full'
        : 'xs:min-w-full md:min-w-[50%] lg:min-w-[35%] xl:min-w-[25%] rounded-md',
    );
    return (
      <div className={className}>
        <div className='flex items-center w-full justify-between pt-2 pb-4'>
          <h3 className='font-semibold'>{title}</h3>
          <Button
            paddingEnabled
            onClick={onClose}
            variant='ghost'
            shape='circle'>
            <X />
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return <Container />;
}
