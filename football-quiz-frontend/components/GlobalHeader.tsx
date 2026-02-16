'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../store/useGameStore';
import { api } from '../lib/api';

export function GlobalHeader() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useGameStore();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setCurrentUser(null);
      router.push('/');
    } catch (err) {
      alert('로그아웃 실패');
    }
  };

  if (!currentUser) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 z-50 px-8 py-4 flex justify-between items-center">
      <div 
        onClick={() => router.push('/mode-select')} 
        className="text-2xl font-black text-green-500 italic cursor-pointer tracking-tighter"
      >
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">
          <span className="text-green-500">F</span>
          <span className="text-gray-300 mx-1">OO</span>
          <span className="text-green-500">T</span>
          <span className="text-gray-400 mx-1">:</span>
          <span className="text-green-400">A</span>
          <span className="text-gray-300">G</span>
          <span className="text-green-500">E</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div 
          onClick={() => router.push('/mypage')}
          className="flex items-center gap-3 cursor-pointer bg-gray-900/50 border border-blue-600 px-4 py-2 rounded-xl hover:border-blue-600 hover:bg-blue-500 transition-all active:scale-95 shadow-lg group"
        >
          <span className="text-blue-500 ml-1 font-bold group-hover:text-white transition-colors">
            {currentUser.nickname}
            <span className="text-gray-200 font-bold group-hover:text-white transition-colors"> 님</span>
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="text-xs font-black text-red-500 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase"
        >
          Logout
        </button>
      </div>
    </header>
  );
}