const User = require('../models/User')

module.exports = (io) => {
    let lobbyUsers = [];
    let rooms = {};

    io.on('connection', async (socket) => {
    const session = socket.request.session;
    
    if (!session || !session.userId) {
        console.log('인증되지 않은 소켓 연결 차단');
        socket.disconnect();
        return;
    }

    const user = await User.findById(session.userId);
    if (!user) { socket.disconnect(); return; }

    console.log(`소켓 인증 성공: ${user.nickname}님 접속`);

    socket.userId = user._id.toString();
    socket.nickname = user.nickname;

    // 로비 입장
    socket.on('join_lobby', () => {
        console.log(`${socket.nickname}님이 로비에 입장`);
        
        lobbyUsers.push({ 
        id: socket.id, 
        name: socket.nickname 
        });
        
        io.emit('lobby_update', { 
        users: lobbyUsers, 
        rooms: Object.values(rooms) 
        });
    });

    // 방 만들기
    socket.on('create_room', ({ roomName, timeLimit }) => {
        console.log(`${socket.nickname}님이 방 생성: ${roomName}`);
        
        const roomId = `room_${Date.now()}`;
        
        rooms[roomId] = {
        id: roomId,
        name: roomName,
        host: socket.id,
        timeLimit: timeLimit || 5,
        quizType: null,
        players: [{ 
            id: socket.id, 
            name: socket.nickname,
            username: socket.username,
            isReady: true 
        }],
        scores: {},
        gameInProgress: false
        };
        
        socket.join(roomId);
        lobbyUsers = lobbyUsers.filter(u => u.id !== socket.id);
        
        socket.emit('room_joined', rooms[roomId]);
        io.emit('lobby_update', { 
        users: lobbyUsers, 
        rooms: Object.values(rooms) 
        });
    });

    // 방 참여
    socket.on('join_room', ({ roomId }) => {
        console.log(`${socket.nickname}님이 ${roomId} 방에 입장 시도`);
        
        const room = rooms[roomId];
        
        if (!room) {
        socket.emit('error', { message: '존재하지 않는 방입니다.' });
        return;
        }
        
        room.players.push({ 
        id: socket.id, 
        name: socket.nickname,
        username: socket.username,
        isReady: false 
        });
        
        socket.join(roomId);
        lobbyUsers = lobbyUsers.filter(u => u.id !== socket.id);
        
        io.to(roomId).emit('room_update', room);
        socket.emit('room_joined', room);
        
        io.emit('lobby_update', { 
        users: lobbyUsers, 
        rooms: Object.values(rooms) 
        });
    });

    // 준비 상태 토글
    socket.on('toggle_ready', ({ roomId }) => {
        const room = rooms[roomId];
        
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        
        if (player && player.id !== room.host) {
        player.isReady = !player.isReady;
        console.log(`${player.name}님 준비 상태: ${player.isReady}`);
        
        io.to(roomId).emit('room_update', room);
        }
    });

    // 퀴즈 종류 선택
    socket.on('select_quiz_type', ({ roomId, quizType, timeLimit }) => {
        const room = rooms[roomId];
        
        if (!room || room.host !== socket.id) return;
        
        room.quizType = quizType;
        if (timeLimit) {
        room.timeLimit = timeLimit;
        }
        
        console.log(`방장이 설정 변경: ${quizType}, ${timeLimit}초`);
        
        io.to(roomId).emit('room_update', room);
    });

    // 퀴즈 시작
    socket.on('start_game', ({ roomId, timeLimit }) => {
        const room = rooms[roomId];
        
        if (!room || room.host !== socket.id) {
        console.log('게임 시작 권한 없음');
        return;
        }
        
        const allReady = room.players
        .filter(p => p.id !== room.host)
        .every(p => p.isReady === true);
        
        if (!allReady || room.players.length < 2) {
        socket.emit('error', { message: '모든 플레이어가 준비되지 않았습니다.' });
        return;
        }

        if (!room.quizType) {
        socket.emit('error', { message: '퀴즈 타입을 선택해주세요.' });
        return;
        }
        
        room.scores = {};
        room.gameInProgress = true;
        
        console.log(`게임 시작! 방: ${room.name}`);
        
        io.to(roomId).emit('game_started', {
        quizType: room.quizType,
        timeLimit: timeLimit || room.timeLimit
        });
    });

    // 점수 제출
    socket.on('submit_score', ({ roomId, score, totalQuestions }) => {
        const room = rooms[roomId];
        
        if (!room) {
        console.log('방을 찾을 수 없음');
        return;
        }
        
        room.scores[socket.id] = {
        playerId: socket.id,
        name: socket.nickname,
        username: socket.username,
        score: score
        };
        
        console.log(`${socket.nickname}님 점수: ${score}/${totalQuestions}`);
        console.log(`현재 제출 인원: ${Object.keys(room.scores).length}/${room.players.length}`);
        
        if (Object.keys(room.scores).length === room.players.length) {
        console.log('모든 참가자 퀴즈 풀이 완료! 결과 계산 중...');
        
        const sortedScores = Object.values(room.scores).sort((a, b) => b.score - a.score);
        
        let currentRank = 1;
        sortedScores.forEach((player, index) => {
            if (index > 0 && sortedScores[index - 1].score > player.score) {
            currentRank = index + 1;
            }
            player.rank = currentRank;
        });
        
        const results = {
            players: sortedScores,
            totalQuestions: totalQuestions
        };
        
        console.log('결과 전송:', results);
        io.to(roomId).emit('game_results', results);
        
        room.gameInProgress = false;
        room.scores = {};
        }
    });

    // 방 나가기
    socket.on('leave_room', ({ returnToLobby = true } = {}) => {
        handleLeaveRoom(socket.id, returnToLobby);
    });

    // 연결 끊김
    socket.on('disconnect', async () => {
        const session = socket.request.session;
        const userId = session?.userId || socket.userId;
        console.log(`소켓 연결 끊김: ${socket.id}`);

        if (userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            currentSocketId: null
        });
        }
        
        handleLeaveRoom(socket.id, false);
    });

    // 방 나가기 공통 처리 함수
    function handleLeaveRoom(socketId, returnToLobby = false) {
        let userName = null;
        
        for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIdx = room.players.findIndex(p => p.id === socketId);
        
        if (playerIdx !== -1) {
            userName = room.players[playerIdx].name;
            
            if (room.host === socketId) {
            console.log(`방장 퇴장으로 방 삭제: ${room.name}`);
            room.players.forEach(player => {
                if (player.id !== socketId) {
                const alreadyInLobby = lobbyUsers.find(u => u.id === player.id);
                if (!alreadyInLobby) {
                    lobbyUsers.push({ id: player.id, name: player.name });
                }
                }
            });
            io.to(roomId).emit('room_deleted');
            delete rooms[roomId];
            } else {
            console.log(`${userName}님이 방에서 퇴장`);
            room.players.splice(playerIdx, 1);
            
            if (room.scores[socketId]) {
                delete room.scores[socketId];
            }
            
            io.to(roomId).emit('room_update', room);
            }
            break;
        }
        }
        
        if (returnToLobby && userName) {
        const existingUser = lobbyUsers.find(u => u.id === socketId);
        if (!existingUser) {
            lobbyUsers.push({ id: socketId, name: userName });
            console.log(`${userName}님이 로비로 복귀`);
        }
        } else {
        lobbyUsers = lobbyUsers.filter(u => u.id !== socketId);
        }
        
        io.emit('lobby_update', { 
        users: lobbyUsers, 
        rooms: Object.values(rooms) 
        });
    }
    });
};