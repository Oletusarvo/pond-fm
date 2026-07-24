import { Heart, House, Rss, Sprout } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  return (
    <footer className='flex items-center gap-16 w-full bg-primary text-white p-4 justify-center border-t-slate-200 border-t'>
      <Button
        variant='ghost'
        shape='circle'
        onClick={() => navigate('/')}>
        <House />
      </Button>
      <Button
        onClick={() => navigate('/discover')}
        variant='ghost'
        shape='circle'>
        <Sprout />
      </Button>
      <Button
        variant='ghost'
        shape='circle'>
        <Rss />
      </Button>
    </footer>
  );
}
