import { Spinner } from './spinner';

export function LoadingFiller() {
  return (
    <div className='flex flex-col w-full h-full items-center justify-center flex-1'>
      <Spinner />
    </div>
  );
}
