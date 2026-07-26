import { ArrowUpCircle, Menu } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/providers/auth-provider';

export function MainHeader() {
  const navigate = useNavigate();
  const { status } = useAuthContext();
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <h2 className='font-semibold cursive text-lg'>
        🐸<span className='text-lg'>Pond.fm</span>
      </h2>
      <div className='flex gap-4 items-center'>
        {status === 'authorized' ? (
          <Button
            variant='ghost'
            onClick={() => navigate('/upload')}>
            <ArrowUpCircle />
          </Button>
        ) : null}

        <Button variant='ghost'>
          <Menu />
        </Button>
      </div>
    </header>
  );
}
