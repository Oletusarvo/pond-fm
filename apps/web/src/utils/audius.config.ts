const AUDIUS_API_KEY = "3e6439e7656e185f132b5353acdba8e2396b1d74";
const REDIRECT_URI = import.meta.env.PROD
  ? "https://pond-fm.onrender.com/login/callback"
  : "http://localhost:5173/login/callback";

export const audiusSdk = (window as any).audiusSdk({
  apiKey: AUDIUS_API_KEY,
  redirectUri: REDIRECT_URI,
});
