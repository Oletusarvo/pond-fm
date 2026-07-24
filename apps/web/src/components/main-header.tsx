import { Menu } from 'lucide-react';
import { Button } from './button';

export function MainHeader() {
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <h2 className='font-semibold cursive text-lg'>
        🐸<span className='text-lg'>Pond.fm</span>
      </h2>
      <Button variant='ghost'>
        <Menu />
      </Button>
    </header>
  );
}
