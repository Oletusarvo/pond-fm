import { Network, Rss, Sprout } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../features/auth/providers/auth-provider";

/**Renders the bottom navigation bar. */
export function AppBottomBar() {
  const authService = useAuthContext();

  return (
    <footer className='w-full border-t border-slate-200 bg-white/95 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm md:hidden'>
      <nav
        aria-label='Primary navigation'
        className='mx-auto flex w-full max-w-lg items-center justify-around gap-2'
      >
        <NavButton to='/undiscovered' title='Undiscovered'>
          <Sprout />
        </NavButton>
        <NavButton to='/new' title='New'>
          <Rss />
        </NavButton>
        {authService.status === "authenticated" ? (
          <NavButton to='/followed' title='Followed'>
            <Network />
          </NavButton>
        ) : null}
      </nav>
    </footer>
  );
}

function NavButton({
  children,
  title,
  ...props
}: React.ComponentProps<typeof NavLink> & { title: string }) {
  return (
    <NavLink
      {...props}
      end
      className={({ isActive }) =>
        `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors ${
          isActive
            ? "bg-emerald-50 text-emerald-800"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`
      }
    >
      <span className='flex h-5 items-center justify-center [&>svg]:h-[1.15rem] [&>svg]:w-[1.15rem]'>
        {children}
      </span>
      <span className='truncate'>{title}</span>
    </NavLink>
  );
}
