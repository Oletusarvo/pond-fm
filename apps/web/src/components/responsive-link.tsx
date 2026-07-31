import { Link, useLocation } from 'react-router-dom';
import { useClassName } from '../hooks/use-class-name';

type ResponsiveLinkProps = React.ComponentProps<typeof Link>;

export function ResponsiveLink({
  children,
  className: initialClassName,
  ...props
}: ResponsiveLinkProps) {
  const location = useLocation();
  const className = useClassName(
    initialClassName,
    location.pathname === props.to ? 'text-yellow-200' : '',
  );
  return (
    <Link
      {...props}
      className={className}>
      {children}
    </Link>
  );
}
