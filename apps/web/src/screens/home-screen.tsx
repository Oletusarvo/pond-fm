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

        <span className='text-center text-slate-500'>
          Discover music you want to hear, without algorithms - in chronological order.
        </span>
        <Button
          onClick={heroButtonAction}
          paddingEnabled
          variant='contained'
          shape='rounded'>
          {status === 'authenticated' ? (
            'Logout'
          ) : status === 'unauthenticated' ? (
            'Request Login'
          ) : (
            <Spinner />
          )}
        </Button>
      </section>
      <section className='h-pad py-16 bg-primary text-white flex-1'>
        <h2 className='text-xl font-semibold mb-4'>What is Pond.fm?</h2>
        <p>
          A place where every track gets a fair chance to be heard. The main feed is completely
          chronological. New uploads appear in the order they're shared, and every user can repost a
          track once, bringing it back to the top of the feed so more people can discover it. No
          recommendation algorithms. No pay-to-win promotion. Just people sharing music they
          genuinely enjoy.
          <br />
          <br /> Looking for something truly new? Visit the <strong>Undiscovered</strong> feed,
          where every track has been heard by fewer than 100 unique listeners. Unlike the main feed,
          the undiscovered feed displays tracks in descending order - oldest first - giving every
          newly uploaded track a fair chance to get heard.
          <br />
          <br /> We believe in transparent incentives, community-driven discovery, and giving
          creators an opportunity to be seen without competing against opaque algorithms. Whether
          you're here to discover your next favourite artist or to share your own music with the
          world, every upload starts on equal footing. Human recommendation. Direct artist support.
          Transparent incentives.
        </p>
      </section>
    </>
  );
}
