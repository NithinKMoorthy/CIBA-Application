export const LogoutButton = () => {
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 API route needs a full page navigation
    return <a href="/api/auth/logout"> Log Out </a> 
}