import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Disc3, Music4, Network, Repeat, Rss, Sprout, Users } from "lucide-react";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Spinner } from "../components/spinner";
import { defaults } from "../utils/defaults";
import { FaIconLink } from "../components/fa-icon-link";
import { useScrollToTop } from "../hooks/use-scroll-to-top";
import React from "react";

const appName = "Amphitune";

const impactStats = [
  { label: "Listener threshold", value: `${defaults.plans.free.unique_listener_threshold}+` },
  { label: "Discovery mode", value: "Chronological" },
  { label: "Curated by", value: "You" },
];

const featureCards = [
  {
    title: "Fair discovery",
    description: "Every upload gets a real and equal chance to be heard.",
    icon: Sprout,
  },
  {
    title: "No algorithmic curation",
    description: "The New and Undiscovered feeds stay simple, chronological, and easy to trust.",
    icon: Rss,
  },
  {
    title: "Follow the people you care about",
    description: "See the latest from your favorite artists in one focused, low-noise feed.",
    icon: Network,
  },
  {
    title: "Reposts with intent",
    description:
      "Boost the tracks you love back to the top of the New feed without gaming the system. Reposts on Amphitune cannot be undone.",
    icon: Repeat,
  },
];

function MainImageCard({ children }: React.PropsWithChildren) {
  return (
    <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700'>
      {children}
    </div>
  );
}

/**Renders the home screen. */
export function HomeScreen() {
  const navigate = useNavigate();
  const { toggleLogoutModal, status } = useAuthContext();

  const handlePrimaryAction = () => {
    navigate("/undiscovered");
  };

  const handleAuthAction = () => {
    if (status === "authenticated") {
      toggleLogoutModal(true);
    } else if (status === "unauthenticated") {
      navigate("/login");
    }
  };

  const authButtonLabel =
    status === "authenticated"
      ? "Log out"
      : status === "unauthenticated"
        ? "Log in with Audius"
        : "Loading";

  useScrollToTop();

  return (
    <main className='w-full bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_46%)] text-slate-900'>
      <section className='h-pad py-12 md:py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='rounded-4xl border border-emerald-100/80 bg-white/80 p-5 shadow-lg md:p-8'>
            <div className='mb-8 flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700'>
                  <img
                    src='/assets/frog-2.webp'
                    alt=''
                    className='h-9 w-9 rounded-xl object-cover'
                  />
                </div>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700'>
                    {appName}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
              <div className='max-w-xl'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700'>
                  <Disc3 className='h-4 w-4' />
                  Built for discovery
                </div>

                <h1 className='text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
                  Every track gets a
                  <span className='block bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
                    fair shot.
                  </span>
                </h1>

                <p className='mt-5 text-lg leading-8 text-slate-600'>
                  {appName} is a music discovery layer extending Audius, where new tracks are given
                  a fair and equal chance to get heard without being buried under an obscure
                  recommendation algorithm.
                </p>

                <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                  <button
                    type='button'
                    onClick={handlePrimaryAction}
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800'
                  >
                    Explore tracks
                    <ArrowRight className='h-4 w-4' />
                  </button>

                  <button
                    type='button'
                    onClick={handleAuthAction}
                    className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900'
                  >
                    {status === "loading" ? <Spinner /> : authButtonLabel}
                  </button>
                </div>

                <div className='mt-8 grid gap-3 sm:grid-cols-3'>
                  {impactStats.map((item) => (
                    <div
                      key={item.label}
                      className='rounded-2xl border border-slate-200 bg-slate-50 p-3'
                    >
                      <div className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                        {item.label}
                      </div>
                      <div className='mt-2 text-xl font-bold text-slate-900'>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='relative items-center justify-center xs:hidden lg:flex w-full h-full'>
                <img
                  src='/assets/guitar-frawg.webp'
                  className='absolute -translate-y-40 -translate-x-25 h-56'
                />
                <img
                  src='/assets/synth-frawg.webp'
                  className='absolute translate-y-10 translate-x-10'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='h-pad py-8 md:py-14'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-8 max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700'>
              Why Amphitune
            </p>
            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl'>
              Discovery without the algorithmic fog.
            </h2>
          </div>

          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
            {featureCards.map(({ title, description, icon: Icon }) => (
              <FeatureCard key={title} title={title} description={description} icon={Icon} />
            ))}
          </div>
        </div>
      </section>

      <section className='h-pad pb-14 pt-6 md:pb-20'>
        <div className='mx-auto max-w-5xl rounded-4xl bg-slate-900 px-6 py-8 text-white shadow-lg md:px-8 md:py-10'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-xl'>
              <p className='text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300'>
                Ready to listen differently?
              </p>
              <h3 className='mt-3 text-3xl font-black tracking-tight'>
                Find the next hidden favorite before everyone else does.
              </h3>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <button
                type='button'
                onClick={() => navigate("/undiscovered")}
                className='inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400'
              >
                Dive in
                <ArrowRight className='h-4 w-4' />
              </button>
              <button
                type='button'
                onClick={() => navigate("/login")}
                className='inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10'
              >
                Join for free
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className='w-full bg-slate-950 px-4 py-14 text-slate-200 md:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300'>
                <img src='/assets/frog-2.webp' alt='' className='h-8 w-8 rounded-xl object-cover' />
              </div>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300'>
                  {appName}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <FaIconLink
                faCode='fa-soundcloud'
                to='https://www.soundcloud.com/oletusarvo'
                className='font-medium text-slate-200 hover:text-white'
                target='_blank'
              >
                Soundcloud
              </FaIconLink>
              <FaIconLink
                faCode='fa-bandcamp'
                to='https://oletusarvo.bandcamp.com'
                className='font-medium text-slate-200 hover:text-white'
                target='_blank'
              >
                Bandcamp
              </FaIconLink>
              <FaIconLink
                faCode='fa-instagram'
                to='https://www.instagram.com/oletusarvo.art'
                className='font-medium text-slate-200 hover:text-white'
                target='_blank'
              >
                Instagram
              </FaIconLink>
              <FaIconLink
                faCode='fa-github'
                to='https://github.com/oletusarvo'
                className='font-medium text-slate-200 hover:text-white'
                target='_blank'
              >
                Github
              </FaIconLink>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div>
              <h3 className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400'>
                Resources
              </h3>
              <div className='flex flex-col gap-3'>
                <Link
                  to='/legal/terms-of-service.pdf'
                  className='font-medium text-slate-200 hover:text-white'
                  target='_blank'
                >
                  Terms Of Service
                </Link>
                <Link
                  to='/legal/privacy-policy.pdf'
                  className='font-medium text-slate-200 hover:text-white'
                  target='_blank'
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className='flex flex-col gap-2 text-sm text-slate-400'>
              <Link className='hover:text-white' to='mailto:oletusarvo.music@gmail.com'>
                &copy; App/Site - oletusarvo
              </Link>
              <Link className='hover:text-white' to='mailto:designsbyhayleyjackson@gmail.com'>
                &copy; Artwork - Hayley Jackson
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Sprout;
}) {
  return (
    <div className='rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700'>
        <Icon className='h-5 w-5' />
      </div>
      <h3 className='mb-2 text-xl font-bold text-slate-900'>{title}</h3>
      <p className='leading-7 text-slate-600'>{description}</p>
    </div>
  );
}

function LiveDiscoveryBadge() {
  return (
    <div className='mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 m-4 text-white'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300'>
          <Music4 className='h-5 w-5' />
        </div>
        <div>
          <div className='text-sm font-semibold'>Live discovery</div>
          <div className='text-xs text-slate-300'>Fresh uploads, every day</div>
        </div>
      </div>
      <div className='rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-200'>
        24/7
      </div>
    </div>
  );
}

function HeroImageCard() {
  return (
    <div className='relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-900 shadow-lg'>
      <img
        src='/assets/guitar-frawg.webp'
        alt='Featured artist artwork'
        className='aspect-4/5 w-full rounded-3xl object-cover shadow-inner'
      />

      <div className='mt-4 grid grid-cols-3 gap-3' hidden>
        <div className='rounded-2xl border border-white/10 bg-white/5 p-3 text-white'>
          <div className='mb-1 text-xs uppercase tracking-[0.2em] text-slate-300'>New</div>
          <div className='text-lg font-bold'>1.2k</div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-white/5 p-3 text-white'>
          <div className='mb-1 text-xs uppercase tracking-[0.2em] text-slate-300'>Undis.</div>
          <div className='text-lg font-bold'>41%</div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-white/5 p-3 text-white'>
          <div className='mb-1 text-xs uppercase tracking-[0.2em] text-slate-300'>Followed</div>
          <div className='text-lg font-bold'>870</div>
        </div>
      </div>
    </div>
  );
}

function AudiusLogo() {
  return (
    <div className='flex items-end'>
      <Link to='https://audius.co/' target='_blank'>
        <img
          src='/assets/audius-logo-black.webp'
          width='130px'
          className='invert opacity-90'
          alt='Audius logo'
        />
      </Link>
    </div>
  );
}
