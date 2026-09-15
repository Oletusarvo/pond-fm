import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Spinner } from "../components/spinner";
import { ReactNode } from "react";
import { Network, Repeat, Rss, Sprout } from "lucide-react";
import { PassProps } from "../components/pass-props";
import { defaults } from "../utils/defaults";
import { useClassName } from "../hooks/use-class-name";
import { FaIconLink } from "../components/fa-icon-link";

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
      <section className='h-pad py-16 flex-1'>
        <SectionHeading>What is Pond?</SectionHeading>

        <p className='text-base 2xl:w-[70%]'>
          Pond is a music sharing platform built on a simple idea: your music
          should get a chance to be heard regardless of how popular you are.
          That's where our <strong>Undiscovered</strong> feed comes in. Any
          track with fewer than {defaults.plans.free.unique_listener_threshold}{" "}
          unique listeners (or {defaults.plans.pro.unique_listener_threshold}{" "}
          for Pro accounts), stays there, oldest first, until it reaches it.
          Once your track crosses that threshold, you've genuinely been
          discovered. The <strong>New</strong> feed will display uploaded or
          reposted tracks in chronological order regardless of how many unique
          listeners they have accumulated.
          <br />
          <br />
          To help the right listeners find you, Pond is experimenting with
          allowing tracks to be tagged not by subgenres, but by moods along
          their main genre, because most listeners don't think in a maze of
          subgenres, but how they want music to make them feel.
          <br />
          <br />
          None of the feeds on Pond are driven by engagement based algorithms;
          in fact we don't use algorithms of any kind. Everything is presented
          to you in chronological order.
          <br />
          <br />
        </p>
      </section>
      <section className='h-pad py-16 flex-1'>
        <SectionHeading>Features</SectionHeading>
        <div className='w-full grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
          <FeatureItem
            title='A Fair Shot At Being Discovered'
            icon={<Sprout />}
          >
            Pond implements the <strong>Undiscovered</strong> feed, where all
            uploaded tracks stay until they have accumulated the unique
            listeners defined by their subscription. Tracks on this feed are
            sorted in chronological order, oldest first, so new uploads won't
            bury older ones.
          </FeatureItem>
          <FeatureItem title='No Algorithmic Curation' icon={<Rss />}>
            The <strong>New</strong> feed will display tracks and reposts in
            simple chronological order, newest first. Pond does not, and will
            not implement algorithmic curation.
          </FeatureItem>
          <FeatureItem title='Stay In The Loop' icon={<Network />}>
            The <strong>Followed</strong> feed will display tracks uploaded by
            the users you follow, newest first.
          </FeatureItem>
          <FeatureItem title='Reposts' icon={<Repeat />}>
            Heard a great track you think deserves to be heard by others? Tap
            the repost button to bump the track back to the top of the{" "}
            <strong>New</strong> feed. Reposts on Pond are a commitment and
            cannot be undone.
          </FeatureItem>
        </div>
      </section>
      <section className='h-pad py-16 flex-1 flex flex-col bg-primary/10'>
        <SectionHeading>Account Types</SectionHeading>
        <p className='mb-4 2xl:w-[70%]'>
          Pond has two account tiers: Free and Pro. Pro users receive bigger
          unique listener thresholds and storage quotas for building an audience
          and a catalogue, while supporting the platform. Once you have an
          account, please test the platform out, and if you like it, consider
          upgrading to Pro. The quotas and limits on each tier are preliminary;
          they may be raised in the future depending how the Pond experiment
          performs.
        </p>
        <div className='grid xs:grid-cols-1 md:grid-cols-2 gap-4'>
          <PlanItem
            priceInSubunits={0}
            title='Free'
            listContent={[
              `${defaults.plans.free.unique_listener_threshold} unique listeners on the Undiscovered feed.`,
              `${defaults.plans.free.storage} of storage for your tracks.`,
              "Occasional ads among the feeds to help keep us afloat.",
            ]}
          >
            A basic plan for your artistry. Provides enough free storage space
            to make a difference, and a reasonable threshold for unique
            listeners for your tracks. We recommend free plans to upload mp3
            files to make the most of their quota. All new accounts start on
            this plan.
          </PlanItem>
          <PlanItem
            priceInSubunits={500}
            title='Pro'
            listContent={[
              `${defaults.plans.pro.unique_listener_threshold} unique listeners on the Undiscovered feed.`,
              `${defaults.plans.pro.storage} of storage for your tracks.`,
              "No ads ever.",
            ]}
          >
            For those who don't want to run out of space anytime soon, want to
            keep their tracks around on the undiscovered-feed a little longer,
            and want to support the platform. Upgrading to this plan can be done
            once you have logged in for the first time.
          </PlanItem>
        </div>
      </section>
      <section className='h-pad py-16 flex-1 flex flex-col bg-primary/10'>
        <SectionHeading>Early Access</SectionHeading>
        <p>
          Pond is just now getting started. We have implemented the bare minimum
          for the idea to be viable and provide users its core value, thus the
          service does not support comments, profile- or track images, yet. If
          the service turns out to work out, these will be added later.
        </p>
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
        </div>
        <div className='mt-auto text-sm italic '>&copy; oletusarvo 2026</div>
      </footer>
    </>
  );
}

function SectionHeading({
  children,
}: Omit<React.ComponentProps<"h2">, "className">) {
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
      <p>{children}</p>
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
          <span className='text-3xl'>
            {(Math.round(price * 100) / 100).toLocaleString("en")}
          </span>
          <span className='text-slate-500'>€/month</span>
        </div>
        {price > 0 ? <small>Billed annually</small> : null}
      </div>

      <p>{children}</p>
      <ul className='list-disc text-slate-700'>
        {listContent.map((content, i) => {
          return <li key={i}>{content}</li>;
        })}
      </ul>
    </div>
  );
}
