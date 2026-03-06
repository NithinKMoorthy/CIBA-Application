// app/page.tsx
import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import Home from '@/components/home/home';

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;

  console.log("User:", user);

  // If you need an access token for the user (e.g., for API calls server-side)
  // const tokenResponse = await getAccessToken();
  // console.log("Access token:", tokenResponse?.accessToken);

  return (
    <div className="flex flex-grow flex-col bg-[url('/banking-test.webp')] bg-cover">
      <Home />
    </div>
  );
}
