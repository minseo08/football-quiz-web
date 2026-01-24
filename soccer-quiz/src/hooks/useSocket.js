import { useState, useCallback } from 'react';
import { 
  initializeSocket, 
  setupSocketListeners, 
  socketEmit, 
  disconnectSocket,
  getSocket 
} from '../services/socket';
import { shuffleArray } from '../utils/helpers';
import { VIEWS } from '../constants/config';

export const useSocket = (
  allQuizzesRef, 
  setFilteredQuizzes, 
  setTimeLimit, 
  setTimeLeft,
  setCurrentStep,
  setScore,
  setUserInput,
  setView
) => {
  const [participants, setParticipants] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(5);
  const [gameResults, setGameResults] = useState(null);

  const initialize = useCallback(() => {
    const socket = initializeSocket();

    setupSocketListeners({
      onLobbyUpdate: (users, rooms) => {
        setParticipants(users);
        setRoomList(rooms);
      },
      
      onRoomJoined: (roomData) => {
        setCurrentRoom(roomData);
        setView(VIEWS.ROOM_WAITING);
      },
      
      onRoomUpdate: (updatedRoom) => {
        setCurrentRoom(updatedRoom);
      },
      
      onRoomDeleted: () => {
        alert("방장이 방을 나갔습니다. 로비로 돌아갑니다.");
        setCurrentRoom(null);
        setSelectedQuizType(null);
        setView(VIEWS.LOBBY);
      },
      
      onGameStarted: (quizType, timeLimit) => {
        const currentQuizzes = allQuizzesRef.current;
        const filtered = currentQuizzes.filter(
          q => q.type?.toLowerCase().trim() === quizType.toLowerCase()
        );
        if (filtered.length === 0) {
          alert("퀴즈 데이터를 불러올 수 없습니다.");
          return;
        }
        const randomizedQuizzes = shuffleArray(filtered);
        
        setFilteredQuizzes(randomizedQuizzes);
        setTimeLimit(timeLimit);
        setTimeLeft(timeLimit);
        setCurrentStep(0);
        setScore(0);
        setUserInput("");
        setView(VIEWS.PLAY);
      },
      
      onGameResults: (results) => {
        setGameResults(results);
        setView(VIEWS.GAME_RESULTS);
      },
      
      onError: (message) => {
        alert(message);
      }
    });

    return socket;
  }, [
    allQuizzesRef, 
    setFilteredQuizzes, 
    setTimeLimit, 
    setTimeLeft, 
    setCurrentStep, 
    setScore, 
    setUserInput, 
    setView
  ]);

  const cleanup = () => {
    disconnectSocket();
  };

  return {
    participants,
    roomList,
    currentRoom,
    setCurrentRoom,
    selectedQuizType,
    setSelectedQuizType,
    selectedTimeLimit,
    setSelectedTimeLimit,
    gameResults,
    setGameResults,
    initializeSocket: initialize,
    cleanupSocket: cleanup,
    socket: getSocket(),
    socketEmit
  };
};