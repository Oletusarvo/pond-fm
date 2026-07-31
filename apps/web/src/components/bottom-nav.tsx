import { Heart, House, Rss, Sprout } from 'lucide-react';
import { Button } from './button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResponsiveLink } from './responsive-link';

export function BottomNav() {
  const navigate = useNavigate();
  return (
    <footer className='xs:flex items-center gap-16 w-full bg-primary text-white p-4 justify-center border-t-green-800 border-t md:hidden'>
      <NavButton to='/'>
        <House />
      </NavButton>
      <NavButton to='/undiscovered'>
        <Sprout />
      </NavButton>
      <NavButton to='/new'>
        <Rss />
      </NavButton>
    </footer>
  );
}

function NavButton({ children, ...props }: React.ComponentProps<typeof ResponsiveLink>) {
  return (
    <ResponsiveLink {...props}>
      <Button
        type='button'
        variant='ghost'
        shape='circle'>
        {children}
      </Button>
    </ResponsiveLink>
  );
}
