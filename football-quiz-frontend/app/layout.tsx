// frontend/app/layout.tsx
'use client';

import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { api } from '../lib/api';
import { GlobalFooter } from '../components/GlobalFooter';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrentUser, currentUser } = useGameStore();

  useEffect(() => {
    if (currentUser) return;

    api.get('/api/auth/check')
      .then(({ data }) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        console.log('인증되지 않은 유저입니다.');
      });
  }, [setCurrentUser, currentUser]);

  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <GlobalFooter />
      </body>
    </html>
  );
}