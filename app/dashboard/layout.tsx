// app/admin/layout.tsx
import React from 'react';
import ProfileNav from './components/nav/ProfileNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full">
      <main className="flex flex-grow w-full">
        <div className="flex flex-grow-[1] h-full border-r max-w-[15%]">
          <ProfileNav />
        </div>
        <div className="flex-grow w-full p-4">{children}</div>
      </main>
  </div>
  );
}
