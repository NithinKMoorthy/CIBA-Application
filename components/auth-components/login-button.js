export const LoginButton = () => {
    return <button className="bg-black hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full">
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 API route needs a full page navigation */}
    <a href="/api/auth/login"> Log In </a> 
  </button>
}