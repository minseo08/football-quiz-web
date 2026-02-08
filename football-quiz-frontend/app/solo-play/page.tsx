'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { api } from '../../lib/api';

export default function SoloPlayPage() {
  const router = useRouter();
  const { filteredQuizzes, currentStep, score, timeLeft, timeLimit, setQuizState, setCurrentUser } = useGameStore();
  const [userInput, setUserInput] = useState('');

  const [isChecking, setIsChecking] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  useEffect(() => {
    if (timeLeft > 0 && !isChecking) {
      const timer = setInterval(() => {
        setQuizState({ timeLeft: timeLeft - 1 });
      }, 1000);
      return () => clearInterval(timer);
    } else if(timeLeft === 0 && !isChecking){
      handleAnswer('');
    }
  }, [timeLeft, isChecking, setQuizState]);


  const syncStats = async (isCorrect: boolean) => {
    try {
      const response = await api.post('/api/users/update-stats', {
        solved: 1,
        correct: isCorrect ? 1 : 0
      });
      if (response.data.success) {
        setCurrentUser(response.data.user);
      }
    } catch (err) {
      console.error("실시간 통계 업데이트 실패:", err);
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQuiz = filteredQuizzes[currentStep];
    if (!currentQuiz) return;

    const cleanSubmitted = String(answer).toLowerCase().trim();

    const isCorrect = Array.isArray(currentQuiz.answer)
      ? currentQuiz.answer.some((a: string) => String(a).toLowerCase().trim() === cleanSubmitted)
      : String(currentQuiz.answer).toLowerCase().trim() === cleanSubmitted;

    setLastAnswerCorrect(isCorrect);
    setIsChecking(true);

    if(isCorrect){
      setQuizState({ score: score + 1 });
    }
    await syncStats(isCorrect);
  }

  const handleNextStep = async () => {
    setIsChecking(false);
    setUserInput('');

    if (currentStep < filteredQuizzes.length - 1) {
      setQuizState({ 
        currentStep: currentStep + 1,
        timeLeft: timeLimit 
      });
    } else {
      // try {
      //   const response = await api.post('/api/users/update-stats', {
      //   solved: filteredQuizzes.length,
      //   correct: score
      //   });
      //   if (response.data.success) {
      //     setCurrentUser(response.data.user); 
      //   }
      // } catch (err) {
      //     console.error("통계 업데이트 실패");
      // }
      setQuizState({ soloResults: { score: score, total: filteredQuizzes.length } });
      router.push('/solo-result');
    }
  };

  if (filteredQuizzes.length === 0) return null;

  const quiz = filteredQuizzes[currentStep];

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 font-black">
        <div className="text-xl text-green-500 italic">Question {currentStep + 1} / {filteredQuizzes.length}</div>
        <div className="absolute top-8 right-30">
          <button 
            onClick={() => {
              if(confirm("퀴즈를 종료할까요?")) {
                router.push('/solo-select');
              }
            }}
            className="px-6 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold p-4"
          >
            나가기
          </button>
        </div>
        <div className={`text-xl ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>남은 시간 : {timeLeft}초</div>

      </div>

      <div className="w-full max-w-2xl aspect-video bg-white rounded-[2.5rem] border-4 border-gray-800 overflow-hidden mb-10 shadow-2xl">
        <img src={quiz.imageUrls[0]} alt="Quiz" className="w-full h-full object-contain" />
      </div>

      <h3 className="text-2xl font-bold mb-4 text-center">{quiz.question}</h3>

      <div className="w-full max-w-md">
        {isChecking ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className={`text-xl font-black mb-4 italic ${lastAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {lastAnswerCorrect ? '정답입니다!' : '오답입니다!'}
            </div>
            <div className="bg-gray-900 p-6 py-3 rounded-2xl mb-8 border border-gray-800">
              <p className="text-gray-500 text-sm font-black uppercase mb-2">정답</p>
              <p className="text-2xl font-black text-white">
                {Array.isArray(quiz.answer) ? quiz.answer[0] : quiz.answer}
              </p>
            </div>
            <button 
              onClick={handleNextStep}
              className="w-full py-2 bg-transparent text-yellow-400 border-1 border-yellow-400 hover:text-black text-xl font-bold rounded-2xl hover:bg-yellow-400 transition transform active:scale-95"
            >
              다음 문제 →
            </button>
          </div>
        ) : (
          quiz.type !== 'player' ? (
            <div className="grid grid-cols-2 gap-4">
              {quiz.options?.map((opt: string) => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="bg-gray-800 p-6 rounded-2xl font-bold text-lg hover:bg-green-600 transition shadow-lg active:scale-95">
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                autoFocus className="w-full p-6 bg-white text-black text-center text-2xl font-black rounded-2xl outline-none focus:ring-4 focus:ring-green-500"
                placeholder="정답을 입력하세요" value={userInput} onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userInput)}
              />
            </div>
          )
        )}
      </div>
    </main>
  );
}