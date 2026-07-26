import { ReactNode } from 'react';
import { Spinner } from '../components/spinner';

export function withAlternateChildren<PropsT>(Component: React.FC<PropsT>) {
  return ({
    children,
    alternate,
    showAlternate,
    ...props
  }: { alternate: ReactNode; showAlternate: boolean } & PropsT & React.PropsWithChildren) => {
    return <Component {...(props as PropsT)}>{showAlternate ? alternate : children}</Component>;
  };
}

export function withLoader<PropsT>(Component: React.FC<PropsT>) {
  return ({
    children,
    loading,
    ...props
  }: { loading?: boolean } & PropsT & React.PropsWithChildren) => {
    const EnhancedComponent = withAlternateChildren(Component);
    return (
      <EnhancedComponent
        {...(props as PropsT)}
        alternate={<Spinner />}
        showAlternate={loading}>
        {children}
      </EnhancedComponent>
    );
  };
}
