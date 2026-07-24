import { X } from 'lucide-react';
import { Button } from './button';

type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  title: string;
};

export function Modal({ children, onClose, title }: ModalProps) {
  function Container() {
    return (
      <div className='w-full flex h-full z-90 items-center justify-center bg-black/20 backdrop-blur-lg p-2 ml-auto mr-auto absolute top-0 left-0'>
        <Body />
      </div>
    );
  }

  function Body() {
    return (
      <div className='bg-white p-4 rounded-md flex flex-col xs:min-w-full md:min-w-[50%] lg:min-w-[35%] xl:min-w-[25%]'>
        <div className='flex items-center w-full justify-between py-2'>
          <h3 className='font-semibold'>{title}</h3>
          <Button
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
