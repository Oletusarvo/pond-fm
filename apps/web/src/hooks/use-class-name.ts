import { useMemo } from 'react';
import { joinStrings } from '../utils/join-strings';

/**Returns the memoized result of a call to joinStrings; using a space as the separator. */
export function useClassName(...classNames: string[]) {
  return useMemo(() => {
    return joinStrings(classNames, ' ');
  }, [classNames]);
}
