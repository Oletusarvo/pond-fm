class FrontEndService {
  constructor(private baseUrl: string) {}

  getLoginRoute({ callbackUrl }: { callbackUrl?: string }) {
    const url = new URL(this.baseUrl + '/login');
    if (callbackUrl) {
      url.searchParams.set('callback_url', callbackUrl);
    }
    return url.toString();
  }
}

export const frontEndService = new FrontEndService(
  process.env.NODE_ENV === 'production'
    ? 'https://cbdc-markka.onrender.com/'
    : 'http://localhost:5173',
);
