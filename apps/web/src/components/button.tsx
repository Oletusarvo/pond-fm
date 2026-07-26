import { withLoader } from '../hoc/with-alternate';
import { useClassName } from '../hooks/use-class-name';
import type { WithoutClassName } from '../utils/without-class-name';

type ButtonProps = WithoutClassName<React.ComponentProps<'button'>> & {
  variant?: 'contained' | 'outlined' | 'ghost' | 'text';
  shadow?: boolean;
  fullWidth?: boolean;
  paddingEnabled?: boolean;
  shape?: 'default' | 'rounded' | 'circle';
};

export function Button({
  children,
  shape = 'default',
  shadow,
  fullWidth,
  paddingEnabled,
  variant = 'contained',
  ...props
}: ButtonProps) {
  const className = useClassName(
    'flex items-center justify-center active:scale-95 cursor-pointer transition-all duration-100 font-semibold gap-2',
    variant === 'contained'
      ? 'bg-primary text-white'
      : variant === 'outlined'
        ? 'border-primary text-primary'
        : '',
    shadow ? 'shadow-md' : '',
    shape === 'circle'
      ? 'rounded-full min-w-4 min-h-4 aspect-square'
      : shape === 'rounded'
        ? 'rounded-md'
        : '',

    variant === 'outlined'
      ? 'border'
      : variant === 'ghost'
        ? 'hover:bg-slate-500/10'
        : 'border-transparent',
    fullWidth ? 'w-full' : '',
    paddingEnabled ? 'py-2 px-4' : '',
  );
  return (
    <button
      {...props}
      className={className}>
      {children}
    </button>
  );
}

export const LoaderButton = withLoader(Button);
