import { Link } from "react-router-dom";
import { useClassName } from "../hooks/use-class-name";
import { Link2 } from "lucide-react";

export function FaIconLink({
  children,
  faCode,
  ...props
}: React.ComponentProps<typeof Link> & { faCode: string }) {
  const iconClassName = useClassName("fa-brands", faCode, "mr-2");
  return (
    <Link
      {...props}
      className={[props.className, "flex flex-row items-center"].join(" ")}
    >
      {faCode ? (
        <i className={iconClassName} />
      ) : (
        <Link2 size='1rem' className='mr-2 text-sm' />
      )}
      {"\t"}
      {children}
    </Link>
  );
}
