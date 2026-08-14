const buildErrorString = <C extends string, T extends string>(category: C, code: T) =>
  `${category}:${code}` as const;
const paymentError = <T extends string>(code: T) => buildErrorString('payment', code);
const authError = <T extends string>(code: T) => buildErrorString('auth', code);
const postError = <T extends string>(code: T) => buildErrorString('post', code);
export const serviceError = {
  auth: {
    unauthorized: authError('unauthorized'),
    forbidden: authError('forbidden'),
    userQuotaExceeded: authError('user-quota-exceeded')
  },
  payment: {
    selfTip: paymentError('self-tip'),
  },
  post: {
    duplicateRepost: postError('double-repost'),
    duplicateLike: postError('duplicate-like'),
    uniqueListenerUpdateFail: postError('unique-listener-update-fail'),
  },
  upload: {
    quotaExceeded: buildErrorString('upload', 'quota-exceeded')
  },
  server: {
    unexpected: buildErrorString('server', 'unexpected'),
  },

} as const;

export const errorValues = [
  ...Object.values(serviceError).map(errType => [...Object.values(errType)]),
].flat();
