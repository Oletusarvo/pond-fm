import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Spinner } from "../components/spinner";
import { ReactNode } from "react";
import { Network, Repeat, Rss, Sprout } from "lucide-react";
import { PassProps } from "../components/pass-props";
import { defaults } from "../utils/defaults";
import { FaIconLink } from "../components/fa-icon-link";

const appName = "Amphitune";
/**Renders the home screen. */
export function HomeScreen() {
  const navigate = useNavigate();
  const { toggleLogoutModal, status } = useAuthContext();

  const heroButtonAction = async () => {
    if (status === "authenticated") {
      toggleLogoutModal(true);
    } else if (status === "unauthenticated") {
      //await audiusSdk.oauth.login({ scope: "write" });
      /*
      const url = import.meta.env.PROD
        ? "https://pond-fm-api.onrender.com/api/v1/auth/audius/authorize"
        : "http://localhost:3002/api/v1/auth/audius/authorize";
      window.location.href = url;
      */
      navigate("/login");
    }
  };

  return (
    <>
      <section className='h-pad w-full flex flex-col items-center justify-center py-16 gap-4'>
        <div className='flex flex-col xs:w-full md:w-[50%] items-center gap-8'>
          <div className='flex w-full justify-center'>
            <div className='w-32 h-32 flex items-center justify-center rounded-full bg-primary/10 overflow-hidden relative'>
              <img src='/assets/frog-1.png' className='w-24 h-24 z-10' loading='lazy' />
            </div>
          </div>
          <div className='flex flex-col items-center leading-2'>
            <div className='bg-linear-to-r from-blue-500 to-primary bg-clip-text'>
              <h1 className='text-4xl font-bold text-transparent'>{appName}</h1>
            </div>
            <small>Built on Audius</small>
          </div>
          <div className='flex flex-col gap-1 items-center'>
            <span className='text-center text-base'>
              A music sharing platform where all tracks get a fair shot at getting heard.
            </span>
            <div className='text-red-900 text-sm p-2 border border-red-500/20 bg-red-500/10 rounded-md text-center'>
              The service has not been released yet. This page is a demo.
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={heroButtonAction}
              paddingEnabled
              variant={status === "authenticated" ? "contained" : "outlined"}
              shape='rounded'
              fullWidth
            >
              {status === "authenticated" ? (
                "Logout"
              ) : status === "unauthenticated" ? (
                "Login With Audius"
              ) : (
                <Spinner />
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className='h-pad py-16 flex-1'>
        <SectionHeading>What is {appName}?</SectionHeading>

        <p className='text-base 2xl:w-[70%]'>
          {appName} is a thin discovery layer built on top of <strong>Audius</strong>, with a simple
          idea: your music should get a chance to be heard regardless of how popular you are. That's
          where our <strong>Undiscovered</strong> feed comes in. Any track with fewer than{" "}
          {defaults.plans.free.unique_listener_threshold} unique listeners (or{" "}
          {defaults.plans.pro.unique_listener_threshold} for Pro accounts), stays there, oldest
          first, until it reaches it. Once your track crosses that threshold, you've genuinely been
          discovered. The <strong>New</strong> feed will display uploaded or reposted tracks in
          chronological order regardless of how many unique listeners they have accumulated.
          <br />
          <br />
          None of the feeds on {appName} are driven by engagement based algorithms; in fact we don't
          use algorithms of any kind. Everything is presented to you in chronological order.
          <br />
          <br />
        </p>
        <Button shape='rounded' paddingEnabled onClick={() => navigate("/undiscovered")}>
          Explore Undiscovered Tracks
        </Button>
      </section>
      <section className='h-pad py-16 flex-1'>
        <SectionHeading>Features</SectionHeading>
        <div className='w-full grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
          <FeatureItem title='A Fair Shot At Being Discovered' icon={<Sprout />}>
            {appName} implements the <strong>Undiscovered</strong> feed, where all uploaded tracks
            stay until they have accumulated the unique listeners defined by their subscription.
            Tracks on this feed are sorted in chronological order, oldest first, so new uploads
            won't bury older ones.
          </FeatureItem>
          <FeatureItem title='No Algorithmic Curation' icon={<Rss />}>
            The <strong>New</strong> feed will display tracks and reposts in simple chronological
            order, newest first. {appName} does not, and will not implement algorithmic curation.
          </FeatureItem>
          <FeatureItem title='Stay In The Loop' icon={<Network />}>
            The <strong>Followed</strong> feed will display tracks uploaded by the users you follow,
            newest first.
          </FeatureItem>
          <FeatureItem title='Reposts' icon={<Repeat />}>
            Heard a great track you think deserves to be heard by others? Tap the repost button to
            bump the track back to the top of the <strong>New</strong> feed. Reposts on {appName}{" "}
            are a commitment and cannot be undone. Reposts on Amphitune will not trigger a repost on
            Audius.
          </FeatureItem>
        </div>
      </section>
      <section className='h-pad py-16 flex-1 flex flex-col bg-primary/10'>
        <SectionHeading>Account Types</SectionHeading>
        <p className='mb-4 2xl:w-[70%]'>
          {appName} has two account tiers: Free and Pro. Pro users receive bigger unique listener
          thresholds for building an audience, while supporting the platform. Once you have logged
          in, please test the platform out, and if you like it, consider upgrading to Pro. The
          quotas and limits on each tier are preliminary; they may be raised in the future depending
          how the {appName} experiment performs.
        </p>
        <div className='grid xs:grid-cols-1 md:grid-cols-2 gap-4'>
          <PlanItem
            priceInSubunits={0}
            title='Free'
            listContent={[
              `${defaults.plans.free.unique_listener_threshold} unique listeners per track on the Undiscovered feed.`,
              "Occasional ads among the feeds to help keep us afloat.",
            ]}
          >
            A basic plan for your artistry. Provides a reasonable threshold for unique listeners for
            your tracks to get heard. The feeds will include occasional ads to help us pay our
            bills.
          </PlanItem>
          <PlanItem
            priceInSubunits={500}
            title='Pro'
            listContent={[
              `${defaults.plans.pro.unique_listener_threshold} unique listeners per track on the Undiscovered feed.`,
              "No ads ever.",
            ]}
          >
            For those who hate seeing ads, want to keep their tracks around on the undiscovered-feed
            a little longer, and want to support the platform. Upgrading to this plan can be done
            once you have logged in for the first time.
          </PlanItem>
        </div>
      </section>

      <footer className='bg-gray-800 w-full flex flex-col gap-8 py-32 h-pad text-white xs:items-center md:justify-start md:items-start'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col'>
            <h3 className='mb-2'>Links</h3>
            <FaIconLink
              faCode='fa-soundcloud'
              to='https://www.soundcloud.com/oletusarvo'
              className='font-semibold'
              target='_blank'
            >
              Soundcloud
            </FaIconLink>
            <FaIconLink
              faCode='fa-bandcamp'
              to='https://oletusarvo.bandcamp.com'
              className='font-semibold'
              target='_blank'
            >
              Bandcamp
            </FaIconLink>
            <FaIconLink
              faCode='fa-instagram'
              to='https://www.instagram.com/oletusarvo.art'
              className='font-semibold'
              target='_blank'
            >
              Instagram
            </FaIconLink>
            <FaIconLink
              faCode='fa-github'
              to='https://github.com/oletusarvo'
              className='font-semibold'
              target='_blank'
            >
              Github
            </FaIconLink>
          </div>
          <div className='flex flex-col'>
            <h3 className='mb-2'>Resources</h3>
            <Link to='/legal/terms-of-service.pdf' className='font-semibold' target='_blank'>
              Terms Of Service
            </Link>
            <Link to='/legal/privacy-policy.pdf' className='font-semibold' target='_blank'>
              Privacy Policy
            </Link>
            <Link to='' className='font-semibold' target='_blank'>
              Report Copyright Infringement
            </Link>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='mt-auto text-sm italic'>&copy; oletusarvo 2026</div>
          <Link className='text-sm italic' to='mailto:designsbyhayleyjackson@gmail.com'>
            &copy; Artwork - Hayley Jackson
          </Link>
        </div>
        <Link to='https://audius.co/' target='_blank'>
          <img src='/assets/audius-logo-black.webp' width='130px' className='invert' />
        </Link>
      </footer>
    </>
  );
}

function SectionHeading({ children }: Omit<React.ComponentProps<"h2">, "className">) {
  return <h2 className='text-xl font-semibold mb-4'>{children}</h2>;
}

function FeatureItem({
  children,
  icon,
  title,
}: React.PropsWithChildren & { title: string; icon: ReactNode }) {
  return (
    <div className='rounded-md border-primary/20 bg-primary/10 border py-4 px-8 min-h-64'>
      <div className='flex items-center gap-2 mb-4 text-primary'>
        <div className='rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center'>
          <PassProps size='1rem'>{icon}</PassProps>
        </div>

        <h3 className='font-semibold'>{title}</h3>
      </div>
      <ResponsiveParagraph>{children}</ResponsiveParagraph>
    </div>
  );
}

function PlanItem({
  title,
  priceInSubunits,
  listContent,
  children,
}: React.PropsWithChildren & {
  title: string;
  listContent: string[];
  priceInSubunits: number;
}) {
  const price = priceInSubunits / 100;
  return (
    <div className='rounded-md bg-white py-4 px-8 border border-black/10 flex flex-col gap-4 items-start'>
      <h3 className='text-lg font-semibold text-primary'>{title}</h3>
      <div className='flex flex-col leading-tight'>
        <div className='flex gap-1 items-baseline'>
          <span className='text-3xl'>{(Math.round(price * 100) / 100).toLocaleString("en")}</span>
          <span className='text-slate-500'>€/month</span>
        </div>
        {price > 0 ? <small>Billed annually</small> : null}
      </div>

      <ResponsiveParagraph>{children}</ResponsiveParagraph>
      <ul className='list-disc text-slate-700 mt-auto'>
        {listContent.map((content, i) => {
          return <li key={i}>{content}</li>;
        })}
      </ul>
    </div>
  );
}

function ResponsiveParagraph({ children }: React.ComponentProps<"p">) {
  return <p className='xs:w-full sm:max-w-[70%] md:max-w-full xl:max-w-[70%]'>{children}</p>;
}
