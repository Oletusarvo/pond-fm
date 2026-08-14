export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 500,
    backoff = 2,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw error;
      }

      const wait = delay * backoff ** attempt;

      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }

  throw lastError;
}