import { io } from "socket.io-client";
import { API_URL } from '../constants/config';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(API_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const setupSocketListeners = (handlers) => {
  if (!socket) return;

  socket.on("connect", () => {
    console.log("서버 연결됨:", socket.id);
  });

  socket.on("lobby_update", ({ users, rooms }) => {
    console.log("로비 업데이트:", { users, rooms });
    handlers.onLobbyUpdate?.(users, rooms);
  });

  socket.on("room_joined", (roomData) => {
    console.log("방 입장:", roomData);
    handlers.onRoomJoined?.(roomData);
  });

  socket.on("room_update", (updatedRoom) => {
    console.log("방 업데이트:", updatedRoom);
    handlers.onRoomUpdate?.(updatedRoom);
  });

  socket.on("room_deleted", () => {
    handlers.onRoomDeleted?.();
  });

  socket.on("game_started", ({ quizType, timeLimit }) => {
    console.log("게임 시작!", { quizType, timeLimit });
    handlers.onGameStarted?.(quizType, timeLimit);
  });

  socket.on("game_results", (results) => {
    console.log("게임 결과 수신:", results);
    handlers.onGameResults?.(results);
  });

  socket.on("error", ({ message }) => {
    handlers.onError?.(message);
  });

  socket.on("disconnect", () => {
    console.log("서버 연결 끊김");
  });
};

// Socket 이벤트 발행 함수들
export const socketEmit = {
  joinLobby: () => {
    socket?.emit("join_lobby");
  },

  createRoom: (roomName, timeLimit = 5) => {
    socket?.emit('create_room', { roomName, timeLimit });
  },

  joinRoom: (roomId) => {
    socket?.emit('join_room', { roomId });
  },

  leaveRoom: (returnToLobby = true) => {
    socket?.emit('leave_room', { returnToLobby });
  },

  toggleReady: (roomId) => {
    socket?.emit('toggle_ready', { roomId });
  },

  selectQuizType: (roomId, quizType, timeLimit) => {
    socket?.emit('select_quiz_type', { roomId, quizType, timeLimit });
  },

  startGame: (roomId, timeLimit) => {
    socket?.emit('start_game', { roomId, timeLimit });
  },

  submitScore: (roomId, score, totalQuestions) => {
    socket?.emit('submit_score', { roomId, score, totalQuestions });
  }
};