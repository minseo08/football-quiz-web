'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { socket } from '../../lib/socket';

export default function GamePage() {
  const router = useRouter();
  const { 
    filteredQuizzes, currentStep, score, timeLeft, timeLimit, setQuizState, currentRoom 
  } = useGameStore();
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setQuizState({ timeLeft: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswer('');
    }
    return () => clearInterval(timer);
  }, [timeLeft, setQuizState]);

  const handleAnswer = (submittedAnswer: string) => {
    const currentQuiz = filteredQuizzes[currentStep];
    if (!currentQuiz) {
      console.error("퀴즈 데이터가 없습니다! 현재 스텝:", currentStep);
      return;
    }

    const isCorrect = Array.isArray(currentQuiz.answer)
      ? currentQuiz.answer.some((ans: string) => ans.toLowerCase().trim() === submittedAnswer.toLowerCase().trim())
      : currentQuiz.answer.toLowerCase().trim() === submittedAnswer.toLowerCase().trim();

    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setQuizState({ score: nextScore });

    console.log(`현재 스텝: ${currentStep}, 전체 문제 수: ${filteredQuizzes.length}`);

    const isLastQuestion = currentStep >= filteredQuizzes.length - 1;

    if (!isLastQuestion) {
      console.log("다음 문제로 이동합니다.");
      setQuizState({ currentStep: currentStep + 1, timeLeft: timeLimit });
      setUserInput('');
    } else {
      console.log("전송 데이터 체크:", {
        roomId: currentRoom?.id,
        score: nextScore,
        total: filteredQuizzes.length
      });

      if (!currentRoom?.id) {
        console.error("오류: roomId가 없습니다! 로비로 튕길 수 있습니다.");
      }
      
      socket.emit('submit_score', { 
        roomId: currentRoom?.id, 
        score: nextScore,
        total: filteredQuizzes.length 
      });

      setUserInput('');
      router.push('/waiting-results');
    }
  };

  if (filteredQuizzes.length === 0) return null;

  const quiz = filteredQuizzes[currentStep];
  const quizType = quiz.type?.toLowerCase().trim();
  const isMultipleChoice = quizType === 'logo' || quizType === 'stadium';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="text-xl font-black text-green-500 italic">
          QUESTION {currentStep + 1} / {filteredQuizzes.length}
        </div>
        <div className={`text-4xl font-black ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          남은 시간:{timeLeft}초
        </div>
      </div>

      <div className="w-full max-w-2xl aspect-video bg-white rounded-[2.5rem] border-4 border-gray-800 overflow-hidden mb-8 shadow-2xl relative p-4">
        <img 
          src={quiz.imageUrls?.[0] || '/placeholder-football.jpg'} 
          alt="Quiz" 
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-2xl font-bold mb-10 text-center">{quiz.question}</h3>

      <div className="w-full max-w-md">
        {isMultipleChoice ? (
          <div className="grid grid-cols-2 gap-4">
            {quiz.options?.map((option: string) => (
              <button 
                key={option}
                onClick={() => handleAnswer(option)}
                className="bg-gray-900 p-6 rounded-2xl font-bold text-lg border-2 border-gray-800 hover:border-green-500 hover:bg-green-600/10 transition-all active:scale-95 shadow-lg"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleAnswer(userInput); }}>
              <input
                autoFocus
                type="text"
                placeholder="정답을 입력하세요!"
                className="w-full p-6 bg-white text-black text-center text-2xl font-black rounded-2xl shadow-xl focus:ring-4 focus:ring-green-500 outline-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button className="hidden" type="submit">제출</button>
            </form>
            <p className="text-center text-gray-500 font-medium italic">Type and press Enter</p>
          </div>
        )}
      </div>
    </main>
  );
}