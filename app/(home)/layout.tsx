import React from 'react';
import ClientWrapper from '../components/ClientWrapper';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <ClientWrapper>
        <main className="flex-grow p-4 pb-24">
          {children}
        </main>
      </ClientWrapper>
    </div>
  );
}