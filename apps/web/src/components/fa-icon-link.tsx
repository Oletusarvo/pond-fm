import { Link } from "react-router-dom";
import { useClassName } from "../hooks/use-class-name";

export function FaIconLink({
  children,
  faCode,
  ...props
}: React.ComponentProps<typeof Link> & { faCode: string }) {
  const iconClassName = useClassName("fa-brands", faCode, "mr-2");
  return (
    <Link {...props}>
      <i className={iconClassName} />
      {"\t"}
      {children}
    </Link>
  );
}
