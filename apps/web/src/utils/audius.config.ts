const AUDIUS_API_KEY = "3e6439e7656e185f132b5353acdba8e2396b1d74";

export const audiusSdk = (window as any).audiusSdk({
  apiKey: AUDIUS_API_KEY,
  redirectUri: "http://localhost:5173/login/callback",
});
