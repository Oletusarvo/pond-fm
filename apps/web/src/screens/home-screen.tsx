import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Spinner } from "../components/spinner";

/**Renders the home screen. */
export function HomeScreen() {
  const navigate = useNavigate();
  const { toggleLogoutModal, status } = useAuthContext();

  const heroButtonAction = () => {
    if (status === "authenticated") {
      toggleLogoutModal(true);
    } else if (status === "unauthenticated") {
      navigate("/login");
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
        <div className='text-green-900 text-sm p-2 border border-primary/20 bg-primary/10 rounded-md'>
          {" "}
          We're currently in <strong>early access</strong>, with 500 spots open
          — join now while spots remain.
        </div>
        <Button
          onClick={heroButtonAction}
          paddingEnabled
          variant='contained'
          shape='rounded'
        >
          {status === "authenticated" ? (
            "Logout"
          ) : status === "unauthenticated" ? (
            "Continue with email"
          ) : (
            <Spinner />
          )}
        </Button>
      </section>
      <section className='h-pad py-16 bg-primary text-white flex-1'>
        <h2 className='text-xl font-semibold mb-4'>What is Pond.fm?</h2>

        <p className='text-base'>
          Pond.fm is a music sharing platform built on a simple idea: your music
          should get a chance to be heard regardless of how popular you are.
          That's where our <strong>Undiscovered</strong> feed comes in. Any
          track with fewer than 25 unique listeners (or 100 for pro accounts),
          stays there, oldest first — so instead of getting buried under a wave
          of new uploads, your music keeps surfacing to real listeners until it
          earns an audience on its own merit. Once you cross that threshold,
          you've genuinely been discovered. The <strong>New</strong> feed will
          display the newest tracks uploaded or reposted in chronological order
          <br />
          <br />
          To help the right listeners find you, Pond.fm is experimenting with
          allowing tracks to be tagged not by subgenres, but by moods along
          their main genre — because most listeners don't think in a maze of
          subgenres, they think in how they want music to make them feel.
          <br />
          <br />
          No engagement-driven recommendations, no black-box feeds — just
          chronological streams that give every artist a fair shot.
          <br />
          <br />
        </p>
      </section>
      <footer className='bg-gray-800 w-full flex flex-col py-32 h-pad text-white xs:items-center md:items-start'>
        <div className='flex flex-col'>
          <h3 className='mb-4'>Links</h3>
          <Link
            to='https://www.soundcloud.com/oletusarvo'
            className='font-semibold'
            target='_blank'
          >
            Soundcloud
          </Link>
          <Link
            to='https://instagram/oletusarvo'
            className='font-semibold'
            target='_blank'
          >
            Instagram
          </Link>
          <Link
            to='https://instagram/oletusarvo'
            className='font-semibold'
            target='_blank'
          >
            Github
          </Link>
          <Link
            to='/resources/terms-of-service.pdf'
            className='font-semibold'
            target='_blank'
          >
            Terms Of Service
          </Link>
          <Link
            to='/resources/privacy-policy'
            className='font-semibold'
            target='_blank'
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </>
  );
}
