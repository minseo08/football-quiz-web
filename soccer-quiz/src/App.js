import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Constants & Utils
import { VIEWS, GAME_MODES } from './constants/config';
// import { shuffleArray } from './utils/helpers';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useQuiz } from './hooks/useQuiz';
import { useSocket } from './hooks/useSocket';

// Components
import {
  LandingScreen,
  MyPageScreen,
  ModeSelectScreen,
  SoloSelectScreen,
  TimerSelectScreen,
  LobbyScreen,
  RoomWaitingScreen,
  PlayScreen,
  WaitingResultsScreen,
  GameResultsScreen,
  SoloResultsScreen,
  AdminQuizScreen
} from './components';

export default function App() {
  // View & Mode State
  const [view, setView] = useState(VIEWS.MAIN);
  const [gameMode, setGameMode] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [soloResults, setSoloResults] = useState(null);

  // Custom Hooks
  const {
    currentUser,
    isAuthChecking,
    handleLoginSuccess: setCurrentUserAfterLogin,
    handleLogout,
    handleUpdateNickname,
    handleUpdatePassword,
    handleUpdateStats
  } = useAuth();

  const {
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
  } = useQuiz(currentUser);

  const {
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
    initializeSocket,
    cleanupSocket,
    socket,
    socketEmit
  } = useSocket(
    allQuizzesRef,
    setFilteredQuizzes,
    setTimeLimit,
    setTimeLeft,
    setCurrentStep,
    setScore,
    setUserInput,
    setView
  );

  useEffect(() => {
    if (!isAuthChecking) {
      if (currentUser) {
        initializeSocket();
        if (view === VIEWS.MAIN || view === VIEWS.LOADING) {
          setView(VIEWS.MODE_SELECT);
        }
      } else {
        setView(VIEWS.MAIN);
      }
    }
  }, [isAuthChecking, currentUser, initializeSocket, view]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUserAfterLogin(user);
    initializeSocket();
    setView(VIEWS.MODE_SELECT);
  };

  const handleLogoutClick = async () => {
    if (socket) {
      socketEmit.leaveRoom(false);
      cleanupSocket();
    }

    await handleLogout(() => {
      setView(VIEWS.MAIN);
      setGameMode(null);
      setCurrentRoom(null);
    });
  };

  // Solo Mode Handlers
  const startSoloQuiz = (type) => {
    if (startQuizByType(type)) {
      setView(VIEWS.SET_TIMER);
    }
  };

  const startQuiz = (seconds) => {
    startQuizWithTimer(seconds);
    setView(VIEWS.PLAY);
  };

  // Multiplayer Handlers
  const joinLobby = () => {
    socketEmit.joinLobby();
    setView(VIEWS.LOBBY);
  };

  const createRoom = (roomName) => {
    socketEmit.createRoom(roomName);
    setShowCreateRoomModal(false);
  };

  const joinRoom = (roomId) => {
    socketEmit.joinRoom(roomId);
  };

  const leaveRoom = () => {
    socketEmit.leaveRoom(true);
    setCurrentRoom(null);
    setSelectedQuizType(null);
    setView(VIEWS.LOBBY);
  };

  const toggleReady = () => {
    if (!currentRoom) return;
    socketEmit.toggleReady(currentRoom.id);
  };

  const selectQuizType = (quizType) => {
    if (!currentRoom || currentRoom.host !== socket?.id) return;
    setSelectedQuizType(quizType);
    socketEmit.selectQuizType(currentRoom.id, quizType, selectedTimeLimit);
  };

  const selectTimeLimit = (timeLimit) => {
    if (!currentRoom || currentRoom.host !== socket?.id) return;
    setSelectedTimeLimit(timeLimit);
    if (selectedQuizType) {
      socketEmit.selectQuizType(currentRoom.id, selectedQuizType, timeLimit);
    }
  };

  const startMultiplayerGame = () => {
    if (!currentRoom || currentRoom.host !== socket?.id) return;
    if (!selectedQuizType) {
      alert("퀴즈 타입을 먼저 선택해주세요!");
      return;
    }
    socketEmit.startGame(currentRoom.id, selectedTimeLimit);
  };

  const backToModeSelect = () => {
    if (gameMode === GAME_MODES.MULTI) {
      socketEmit.leaveRoom(false);
    }
    setGameMode(null);
    setView(VIEWS.MODE_SELECT);
  };

  // Quiz Play Handler
  const handleAnswer = useCallback((submittedAnswer) => {
    clearInterval(timerRef.current);
    
    const currentQuiz = filteredQuizzes[currentStep];
    if (!currentQuiz) return;
  
    const isCorrect = submittedAnswer.trim().toLowerCase() === 
                      currentQuiz.answer.trim().toLowerCase();
    
    if (isCorrect) setScore(prev => prev + 1);
  
    if (currentStep < filteredQuizzes.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserInput("");
      setTimeLeft(timeLimit);
    } else {
      const finalScore = isCorrect ? score + 1 : score;
      const totalQuestions = filteredQuizzes.length;

      handleUpdateStats(finalScore, totalQuestions);
      
      if (gameMode === GAME_MODES.MULTI && currentRoom) {
        socketEmit.submitScore(currentRoom.id, finalScore, filteredQuizzes.length);
        setView(VIEWS.WAITING_RESULTS);
      } else {
        setSoloResults({
          score: finalScore,
          total: totalQuestions
        });
        setView(VIEWS.SOLO_RESULTS);
      }
      
      resetQuiz();
    }
  }, [filteredQuizzes, currentStep, score, timeLimit, currentRoom, gameMode, 
      timerRef, setScore, setCurrentStep, setUserInput, setTimeLeft, 
      socketEmit, resetQuiz, handleUpdateStats]);

  // Timer Effect
  useEffect(() => {
    if (view === VIEWS.PLAY && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === VIEWS.PLAY && timeLeft === 0) {
      handleAnswer(""); 
    }
  
    return () => clearInterval(timerRef.current);
  }, [view, timeLeft, handleAnswer, timerRef, setTimeLeft]);

  // Loading Screen
  if (isAuthChecking) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  // Render Views
  if (view === VIEWS.MAIN) {
    return (
      <LandingScreen
        showLoginModal={showLoginModal}
        showRegisterModal={showRegisterModal}
        onShowLogin={() => setShowLoginModal(true)}
        onShowRegister={() => setShowRegisterModal(true)}
        onCloseLogin={() => setShowLoginModal(false)}
        onCloseRegister={() => setShowRegisterModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={() => setShowLoginModal(true)}
      />
    );
  }

  if (view === VIEWS.MY_PAGE_VIEW) {
    return (
      <MyPageScreen 
        currentUser={currentUser} 
        onBack={() => setView(VIEWS.MODE_SELECT)}
        onUpdateNickname={handleUpdateNickname} 
        onUpdatePassword={handleUpdatePassword}
      />
    );
  }

  if (view === VIEWS.ADMIN_QUIZ) {
    return (
      <AdminQuizScreen
        currentUser={currentUser}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(VIEWS.MY_PAGE_VIEW)}
        onBack={() => setView(VIEWS.MODE_SELECT)}
      />
    );
  }

  if (view === VIEWS.MODE_SELECT) {
    return (
      <ModeSelectScreen
        currentUser={currentUser}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(VIEWS.MY_PAGE_VIEW)}
        onSelectSolo={() => {
          setGameMode(GAME_MODES.SOLO);
          setView(VIEWS.SOLO_SELECT);
        }}
        onSelectMulti={() => {
          setGameMode(GAME_MODES.MULTI);
          initializeSocket();
          joinLobby();
        }}
        onAdminClick={() => setView(VIEWS.ADMIN_QUIZ)}
      />
    );
  }

  if (view === VIEWS.SOLO_SELECT) {
    return (
      <SoloSelectScreen
        currentUser={currentUser}
        isLoading={isLoading}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(VIEWS.MY_PAGE_VIEW)}
        onBack={backToModeSelect}
        onSelectQuizType={startSoloQuiz}
      />
    );
  }

  if (view === VIEWS.SET_TIMER) {
    return (
      <TimerSelectScreen
        onSelectTime={startQuiz}
        onBack={() => setView(gameMode === GAME_MODES.SOLO ? VIEWS.SOLO_SELECT : VIEWS.SELECT)}
      />
    );
  }

  if (view === VIEWS.SOLO_RESULTS && soloResults) {
    return (
      <SoloResultsScreen
        currentUser={currentUser}
        soloResults={soloResults}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(VIEWS.MY_PAGE_VIEW)}
        onConfirm={() => {
          resetQuiz();
          setSoloResults(null);
          setView(VIEWS.SOLO_SELECT);
        }}
      />
    );
  }

  if (view === VIEWS.LOBBY) {
    return (
      <LobbyScreen
        currentUser={currentUser}
        participants={participants}
        roomList={roomList}
        showCreateRoomModal={showCreateRoomModal}
        onLogout={handleLogoutClick}
        onMyPageClick={null}
        onBack={backToModeSelect}
        onShowCreateRoom={() => setShowCreateRoomModal(true)}
        onCloseCreateRoom={() => setShowCreateRoomModal(false)}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
      />
    );
  }

  if (view === VIEWS.ROOM_WAITING && currentRoom) {
    return (
      <RoomWaitingScreen
        currentUser={currentUser}
        currentRoom={currentRoom}
        socket={socket}
        selectedQuizType={selectedQuizType}
        selectedTimeLimit={selectedTimeLimit}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(null)}
        onLeaveRoom={leaveRoom}
        onToggleReady={toggleReady}
        onSelectQuizType={selectQuizType}
        onSelectTimeLimit={selectTimeLimit}
        onStartGame={startMultiplayerGame}
      />
    );
  }

  if (view === VIEWS.PLAY && filteredQuizzes.length > 0) {
    return (
      <PlayScreen
        filteredQuizzes={filteredQuizzes}
        currentStep={currentStep}
        timeLeft={timeLeft}
        userInput={userInput}
        setUserInput={setUserInput}
        onAnswer={handleAnswer}
      />
    );
  }

  if (view === VIEWS.WAITING_RESULTS) {
    return <WaitingResultsScreen />;
  }

  if (view === VIEWS.GAME_RESULTS && gameResults) {
    return (
      <GameResultsScreen
        currentUser={currentUser}
        gameResults={gameResults}
        onLogout={handleLogoutClick}
        onMyPageClick={() => setView(VIEWS.MY_PAGE_VIEW)}
        onConfirm={() => {
          setGameResults(null);
          setView(VIEWS.ROOM_WAITING);
        }}
        onLeaveRoom={leaveRoom}
      />
    );
  }

  return null;
}