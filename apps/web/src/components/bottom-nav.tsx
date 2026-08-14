import { Heart, House, Network, Rss, Sprout } from 'lucide-react';
import { Button } from './button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResponsiveLink } from './responsive-link';
import { useAuthContext } from '../features/auth/providers/auth-provider';

export function BottomNav() {
  const navigate = useNavigate();
  const authService = useAuthContext();

  return (
    <footer className='xs:flex items-center gap-10 w-full bg-primary text-white justify-center border-t-green-800 border-t md:hidden'>
      <NavButton to='/' title="Home">
        <House size="1.2rem" />
      </NavButton>
      <NavButton to='/undiscovered' title="Undiscovered">
        <Sprout size="1.2rem" />
      </NavButton>
      <NavButton to='/new' title="New">
        <Rss size="1.2rem" />
      </NavButton>
      {
        authService.status === 'authenticated' ? (
          <NavButton to="/followed" title="Followed">
            <Network size="1.2rem" />
          </NavButton>
        ) : null
      }
    </footer>
  );
}

function NavButton({ children, title, ...props }: React.ComponentProps<typeof ResponsiveLink> & { title: string }) {
  return (
    <ResponsiveLink {...props}>
      <Button
        color="inherit"
        type='button'
        variant='ghost'
        shape='circle'>
        <div className="flex flex-col w-full items-center leading-0">
          {children}
          <small className="text-xs">{title}</small>
        </div>

      </Button>
    </ResponsiveLink>
  );
}
