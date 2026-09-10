/**Delays the execution of a function. */
export function debounce<TArgs extends any[], TRet>(
  fn: (...args: TArgs) => TRet | Promise<TRet>,
  timeout: number,
) {
  let t;

  return (...args: TArgs) => {
    clearTimeout(t);
    return new Promise<TRet>(async (resolve, reject) => {
      t = setTimeout(async () => {
        try {
          const ret = await fn(...args);
          resolve(ret);
        } catch (err) {
          reject(err);
        }
      }, timeout);
    });
  };
}

type TCancelPrevious<TRet> =
  | {
      executed: true;
      value: TRet;
    }
  | {
      executed: false;
      value: null;
    };

/**Executes a function after a delay; canceling the call if called again before the delay. */
export function cancelPrevious<TArgs extends any[], TRet>(
  fn: (...args: TArgs) => (TRet | null) | Promise<TRet | null>,
  delay: number,
) {
  let t = null;
  return (...args: TArgs) => {
    return new Promise<TCancelPrevious<TRet>>((resolve, reject) => {
      try {
        if (!t) {
          t = setTimeout(async () => {
            const value = await fn(...args);
            t = null;
            resolve({
              executed: true,
              value,
            });
          }, delay);
        } else {
          clearTimeout(t);
          t = null;
          resolve({
            executed: false,
            value: null,
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  };
}
