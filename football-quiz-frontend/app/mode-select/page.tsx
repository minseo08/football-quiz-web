'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { GlobalHeader } from '../../components/GlobalHeader';

export default function ModeSelectPage() {
  const router = useRouter();
  const { currentUser } = useGameStore();
  const isGuest = !currentUser;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
      <GlobalHeader />
      
      <h1 className="text-5xl font-black mb-16 text-green-500 italic tracking-tighter">MODE SELECT</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div 
          onClick={() => router.push('/solo-select')}
          className="group p-10 bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 hover:border-green-500 cursor-pointer transition shadow-2xl flex flex-col items-center text-center"
        >
          <div className="mode-icon mb-6">
            <img src="/single.png" alt="아이콘" width="60" />
          </div>
          <h2 className="text-3xl font-bold mb-3 group-hover:text-green-400">SOLO PLAY</h2>
          <p className="text-gray-500 text-lg">혼자서 즐기는 실력 테스트</p>
        </div>

        <div 
          onClick={() => {
            if (isGuest) {
              alert('멀티모드는 로그인 후 이용 가능합니다.');
              return;
            }
            router.push('/lobby');
          }}
          className={`group p-10 bg-gray-900 rounded-[2.5rem] border-2 transition shadow-2xl flex flex-col items-center text-center relative
            ${isGuest ? 'opacity-50 cursor-not-allowed border-gray-900' : 'border-gray-800 hover:border-green-500 cursor-pointer'}
          `}
        >
          {isGuest && (
            <div className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
              Login Required
            </div>
          )}
          <div className="mode-icon mb-6">
            <img src="/multi.png" alt="아이콘" width="70" className={isGuest ? 'grayscale' : ''} />
          </div>
          <h2 className={`text-3xl font-bold mb-3 ${!isGuest && 'group-hover:text-green-400'}`}>MULTI PLAY</h2>
          <p className="text-gray-500 text-lg">다른 사람과 실시간 퀴즈 대결</p>
        </div>
      </div>
    </main>
  );
}