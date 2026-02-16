'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { useQuiz } from '../../hooks/useQuiz';
import { GlobalHeader } from '../../components/GlobalHeader';

export default function SoloSelectPage() {
  const router = useRouter();
  const { fetchQuizzes, allQuizzes } = useQuiz();
  const { setQuizState, resetGame } = useGameStore();

  const handleSelectCategory = async (category: string) => {
    resetGame();
    await fetchQuizzes();

    const latestQuizzes = useQuiz.getState().allQuizzes;
    const filtered = latestQuizzes.filter(
      (q: any) => q.type?.toLowerCase().trim() === category.toLowerCase()
    );

    if (filtered.length === 0) {
      alert('해당 카테고리에 등록된 퀴즈가 없습니다. 관리자 페이지에서 먼저 등록해주세요!');
      return;
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuizState({
      filteredQuizzes: shuffled,
      currentStep: 0,
      score: 0,
      timeLimit: 10,
      timeLeft: 10,
    });

    router.push('/solo-setup');
  };

  return (
    <main className="h-screen bg-gray-950 text-white pt-24 p-8 flex flex-col overflow-hidden">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        <button onClick={() => router.push('/mode-select')} className="text-gray-400 mt-5 mb-10 hover:text-white">
          ← 모드 선택으로
        </button>
        <h2 className="text-4xl font-black text-green-500 mb-2 italic">SOLO MODE</h2>
        <p className="text-gray-500 mb-6 font-bold">도전할 퀴즈 유형을 선택하세요</p>

        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            <button 
              onClick={() => handleSelectCategory('logo')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/logo.png" alt="아이콘" width="70" />
              </div>
              <h3 className="text-2xl font-black mb-2">로고로 클럽 맞히기</h3>
              <p className="text-gray-500 text-sm">객관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('player')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/player.png" alt="아이콘" width="70" />
              </div>
              <h3 className="text-2xl font-black mb-2">선수 이름 맞히기</h3>
              <p className="text-gray-500 text-sm">주관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('stadium')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/stadium.png" alt="아이콘" width="70" />
              </div>
              <h3 className="text-2xl font-black mb-2">경기장 맞히기</h3>
              <p className="text-gray-500 text-sm">객관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('nationality')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/nationality.png" alt="아이콘" width="70" />
              </div>
              <h3 className="text-2xl font-black mb-2">선수 국적 맞히기</h3>
              <p className="text-gray-500 text-sm">객관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('career')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/career.png" alt="아이콘" width="70" />
              </div>
              <h3 className="text-2xl font-black mb-2">커리어로 선수 맞히기</h3>
              <p className="text-gray-500 text-sm">주관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('squad_nation')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/squad_nation.png" alt="아이콘" width="60" />
              </div>
              <h3 className="text-2xl font-black mb-2">국적으로 클럽 맞히기</h3>
              <p className="text-gray-500 text-sm">주관식</p>
            </button>

            <button 
              onClick={() => handleSelectCategory('coach')}
              className="bg-gray-900 p-10 rounded-[2rem] border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col items-center text-center"
            >
              <div className="mode-icon mb-6">
                <img src="/coach.png" alt="아이콘" width="60" />
              </div>
              <h3 className="text-2xl font-black mb-2">감독 이름 맞히기</h3>
              <p className="text-gray-500 text-sm">주관식</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}