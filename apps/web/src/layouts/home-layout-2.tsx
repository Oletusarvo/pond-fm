import { Link, Outlet, useNavigate } from "react-router-dom";
import { useOnPathname } from "../hooks/use-on-pathname";
import { useClassName } from "../hooks/use-class-name";
import { ReactNode } from "react";
import { Home, Rss, Sprout } from "lucide-react";

export function HomeLayout2() {
  return (
    <div className='flex w-full h-full h-pad'>
      <section className='flex flex-col flex-1 gap-2'>
        <h2 className='text-primary font-semibold text-lg ml-4'>Browse</h2>
        <SectionButton to='/' icon={<Home />}>
          Home
        </SectionButton>
        <SectionButton to='/undiscovered' icon={<Sprout />}>
          Undiscovered
        </SectionButton>
        <SectionButton to='/new' icon={<Rss />}>
          New
        </SectionButton>
      </section>
      <section className='flex flex-col flex-5 grow-0'>
        <Outlet />
      </section>
    </div>
  );
}

function SectionButton({
  children,
  icon,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"button"> &
  Pick<React.ComponentPropsWithRef<typeof Link>, "to"> & { icon?: ReactNode }) {
  const selected = useOnPathname(to as string);
  const navigate = useNavigate();
  const className = useClassName(
    "px-4 py-2 rounded-[100px] font-semibold text-start flex gap-4 items-center",
    selected ? "bg-primary/10" : "bg-transparent",
  );

  const onClick = () => {
    navigate(to);
  };

  return (
    <button {...props} onClick={onClick} className={className}>
      {icon}
      {children}
    </button>
  );
}
