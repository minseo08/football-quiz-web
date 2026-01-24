import { useState, useEffect, useRef, useCallback } from 'react';
import { quizAPI } from '../services/api';
import { shuffleArray } from '../utils/helpers';

export const useQuiz = (currentUser) => {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLimit, setTimeLimit] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef(null);
  const allQuizzesRef = useRef([]);

  const fetchQuizzes = useCallback(async () => {
    console.log("MongoDB API로 데이터 호출 시도");
    setIsLoading(true);
    
    try {
      const data = await quizAPI.fetchQuizzes();

      if (data.success) {
        setAllQuizzes(data.quizzes);
        allQuizzesRef.current = data.quizzes;
        console.log("퀴즈 로드 완료:", data.quizzes);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("데이터 호출 실패:", err);
      alert("퀴즈 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser && allQuizzes.length === 0 && !isLoading) {
      fetchQuizzes();
    }
  }, [currentUser, allQuizzes.length, isLoading, fetchQuizzes]);

  const startQuizByType = (type) => {
    const filtered = allQuizzes.filter(q => q.type?.toLowerCase().trim() === type);
    if (filtered.length === 0) {
      alert(`'${type}' 유형의 퀴즈 데이터가 없습니다.`);
      return false;
    }
    const shuffled = shuffleArray(filtered);
    setFilteredQuizzes(shuffled);
    return true;
  };

  const startQuizWithTimer = (seconds) => {
    setTimeLimit(seconds);
    setTimeLeft(seconds);
    setCurrentStep(0);
    setScore(0);
    setUserInput("");
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentStep(0);
    setUserInput("");
    setFilteredQuizzes([]);
  };

  return {
    allQuizzes,
    allQuizzesRef,
    filteredQuizzes,
    setFilteredQuizzes,
    currentStep,
    setCurrentStep,
    score,
    setScore,
    userInput,
    setUserInput,
    isLoading,
    timeLimit,
    setTimeLimit,
    timeLeft,
    setTimeLeft,
    timerRef,
    startQuizByType,
    startQuizWithTimer,
    resetQuiz
  };
};