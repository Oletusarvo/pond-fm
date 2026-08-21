import { useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { useAuthContext } from '../features/auth/providers/auth-provider';
import { Spinner } from '../components/spinner';

export function HomeScreen() {
  const navigate = useNavigate();
  const { toggleLogoutModal, status } = useAuthContext();

  const heroButtonAction = () => {
    if (status === 'authenticated') {
      toggleLogoutModal(true);
    } else if (status === 'unauthenticated') {
      navigate('/login');
    }
  };

  return (
    <>
      <section className='h-pad w-full flex flex-col items-center justify-center py-16 gap-4'>
        <div className='bg-linear-to-r from-blue-500 to-primary bg-clip-text'>
          <h1 className='text-4xl font-semibold text-transparent'>Pond.fm</h1>
        </div>

        <span className='text-center text-base'>
          Your music shouldn't have to fight for attention.
        </span>
        <div className="text-green-900 text-sm p-2 border border-primary/20 bg-primary/10 rounded-md"> We're currently in <strong>early access</strong>, with 500 spots open — join now while spots remain.</div>
        <Button
          onClick={heroButtonAction}
          paddingEnabled
          variant='contained'
          shape='rounded'>
          {status === 'authenticated' ? (
            'Logout'
          ) : status === 'unauthenticated' ? (
            'Continue with email'
          ) : (
            <Spinner />
          )}
        </Button>
      </section>
      <section className='h-pad py-16 bg-primary text-white flex-1'>
        <h2 className='text-xl font-semibold mb-4'>What is Pond.fm?</h2>

        <p className="text-base">
          Pond.fm is a music sharing platform built on a simple idea: your music should be heard because people choose to listen, not because an algorithm decides to show it to them.
          <br /><br />
          We want every musician to get a fair shot at getting heard; that's where our <strong>Undiscovered</strong> feed comes in. Any track with fewer than 100 unique listeners stays there, oldest first — so instead of getting buried under a wave of new uploads, your music keeps surfacing to real listeners until it earns an audience on its own merit. Once you cross that threshold, you've genuinely been discovered.
          <br /><br />
          To help the right listeners find you, tracks can be tagged by genre and mood — because most listeners don't think in a maze of subgenres, they think in how they want music to make them feel.
          <br /><br />
          No engagement-driven recommendations, no black-box feeds — just chronological streams that give every artist a fair shot.
          <br /><br />

        </p>
      </section>
    </>
  );
}
