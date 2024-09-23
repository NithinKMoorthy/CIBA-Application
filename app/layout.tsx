import type { Metadata } from "next";
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Banner from '@/components/home/banner';
import './global.css';


export const metadata: Metadata = {
  title: "Konko Bank",
  description: "Bank of the Future",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <UserProvider>
          
            <main className="flex flex-grow justify-center h-screen">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
