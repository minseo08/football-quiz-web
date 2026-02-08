import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: { origin: 'http://13.209.87.175:3000', credentials: true },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    const sessionMiddleware = session({
      secret: process.env.SESSION_SECRET || 'my-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    });

    server.use((socket: any, next) => {
      sessionMiddleware(socket.request as any, {} as any, (err?: any) => {
        if (err) return next(err);
        next();
      });
    });
    console.log('Socket Middleware 주입 완료');
  }

  async handleConnection(client: Socket) {
    const session = (client.request as any).session;
    if (!session || !session.userId) {
      return client.disconnect();
    }
    console.log(`소켓 연결 성공: ${session.nickname}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const session = (client.request as any).session;
    const room = this.gameService.getRoomByPlayerId(client.id);

    if (room) {
      const roomId = room.id;
      if (room.host === client.id) {
        this.server.to(roomId).except(client.id).emit('room_deleted');
      }
      
      const leaveInfo = this.gameService.leaveRoom(client.id);
      if (leaveInfo && !leaveInfo.deleted && leaveInfo.room) {
        this.server.to(roomId).emit('room_update', leaveInfo.room);
      }
    }

    this.gameService.removeLobbyUser(client.id);
    if (session && session.userId) {
      console.log(`유저 접속 종료: ${session.nickname}`);
      try {
        await this.usersService.updateOnlineStatus(session.userId, false);
      } catch (error) {
        console.error('온라인 상태 업데이트 오류:', error);
      }
    }
    this.broadcastLobbyUpdate();
  }

  @SubscribeMessage('start_game')
  handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; quizzes: any[]; timeLimit: number },
  ) {
    const room = this.gameService.getRoom(data.roomId);
    if (!room) return;

    room.gameInProgress = true;
    room.players.forEach((p: any) => {
      p.score = 0;
      p.finished = false;
    });

    if (room.host !== client.id) {
      return client.emit('error', { message: '방장만 게임을 시작할 수 있습니다.' });
    }
    const limit = room.quizCount || 10;
    const selectedQuizzes = data.quizzes.slice(0, limit);

    this.server.to(data.roomId).emit('game_started', {
      quizzes: selectedQuizzes,
      timeLimit: room.timeLimit,
    });

    room.gameInProgress = true;
    this.broadcastLobbyUpdate();
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomName: string; timeLimit: number },
  ) {
    const session = (client.request as any).session;
    console.log(`방 생성 요청: ${data.roomName} by ${session.nickname}`);

    const room = this.gameService.createRoom(
      client.id,
      session.nickname,
      data.roomName,
      data.timeLimit,
    );

    client.join(room.id);

    client.emit('room_joined', room);

    this.broadcastLobbyUpdate();
  }

  @SubscribeMessage('join_lobby')
  handleJoinLobby(@ConnectedSocket() client: Socket) {
    const session = (client.request as any).session;
    if (session?.nickname) {
      client.join('lobby');
      this.gameService.addLobbyUser(client.id, session.nickname);
      this.broadcastLobbyUpdate();
    }
  }

  @SubscribeMessage('leave_lobby')
  handleLeaveLobby(@ConnectedSocket() client: Socket) {
    client.leave('lobby');
    this.gameService.removeLobbyUser(client.id);
    this.broadcastLobbyUpdate();
  }

  private broadcastLobbyUpdate() {
    this.server.emit('lobby_update', this.gameService.getLobbyData());
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const session = (client.request as any).session;
    const room = this.gameService.joinRoom(data.roomId, client.id, session.nickname);
    
    if (room) {
      client.join(room.id);
      this.gameService.removeLobbyUser(client.id);
      this.server.to(room.id).emit('room_update', room);
      client.emit('room_joined', room);
      this.broadcastLobbyUpdate();
    }
  }

  @SubscribeMessage('toggle_ready')
  handleToggleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const room = this.gameService.toggleReady(data.roomId, client.id);
    if (room) {
      this.server.to(room.id).emit('room_update', room);
    }
  }

  @SubscribeMessage('select_quiz_type')
  handleSelectQuizType(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; quizType: string },
  ) {
    const room = this.gameService.selectQuizType(data.roomId, data.quizType);
    if (room) {
      this.server.to(room.id).emit('room_update', room);
    }
  }

  @SubscribeMessage('select_time_limit')
  handleSelectTimeLimit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; timeLimit: number },
  ) {
    const room = this.gameService.updateTimeLimit(data.roomId, data.timeLimit);
    if (room) {
      this.server.to(room.id).emit('room_update', room);
      this.broadcastLobbyUpdate();
    }
  }

  @SubscribeMessage('select_quiz_count')
  handleSelectQuizCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; quizCount: number },
  ) {
    const room = this.gameService.updateQuizCount(data.roomId, data.quizCount);
    
    if (room) {
      this.server.to(room.id).emit('room_update', room);
      
      this.broadcastLobbyUpdate();
      
      console.log(`[Room ${data.roomId}] 문제 수 변경 완료: ${data.quizCount}개`);
    }
  }

  @SubscribeMessage('submit_score')
  handleSubmitScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; score: number; total: number },
  ) {
    console.log(`[EVENT 수신] submit_score 이벤트 도착! 데이터:`, data);
    console.log(`[CLIENT ID] ${client.id}`);

    const room = this.gameService.getRoom(data.roomId);
    if (!room) {
      console.log(`[ERROR] 방을 찾을 수 없음: ${data.roomId}`);
      return;
    }

    const player = room.players.find((p: any) => p.id === client.id);
    if (player) {
      player.score = data.score;
      player.finished = true;
      console.log(`[제출 확인] 유저: ${player.name}, 점수: ${data.score}`);
    }

    const allFinished = room.players.every((p: any) => p.finished === true);
    console.log(`[체크] 전체 인원: ${room.players.length}명, 완료 인원 확인 중...`);

    if (allFinished) {
      const rankedPlayers = [...room.players]
        .sort((a, b) => b.score - a.score)
        .map((p, index) => ({
          playerId: p.id,
          name: p.name,
          score: p.score,
          rank: index + 1,
        }));

      console.log(`[결과 방송] 방 ID: ${data.roomId} - 모든 인원 제출 완료!`);
      this.server.to(data.roomId).emit('game_results', {
        totalQuestions: data.total,
        players: rankedPlayers,
      });
      room.gameInProgress = false;
      room.players.forEach((p: any) => {
        p.finished = false;
        if (p.id !== room.host) p.isReady = false;
      });
      this.broadcastLobbyUpdate();
    }else {
      const pending = room.players.filter((p: any) => !p.finished).map((p: any) => p.name);
      console.log(`[대기 중] 아직 안 끝난 사람: ${pending.join(', ')}`);
    }
  }

  @SubscribeMessage('back_to_room')
  handleBackToRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const room = this.gameService.getRoom(data.roomId);
    if (!room) return;
    client.emit('room_joined', room);
    const player = room.players.find(p => p.id === client.id);
    if (player) {
      player.finished = false;
      if (player.id !== room.host) {
        player.isReady = false;
      }
    }

    const anyStillPlaying = room.players.some(p => p.finished === true);
    if (!anyStillPlaying) {
      room.gameInProgress = false;
      this.broadcastLobbyUpdate();
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const room = this.gameService.getRoomByPlayerId(client.id);

    if (room) {
      const roomId = room.id;
      const isHost = room.host === client.id;

      if (isHost) {
        this.server.to(roomId).except(client.id).emit('room_deleted');
      }

      const leaveInfo = this.gameService.leaveRoom(client.id);

      if (leaveInfo && !leaveInfo.deleted && leaveInfo.room) {
        this.server.to(roomId).emit('room_update', leaveInfo.room);
      }
    }

    client.emit('left_room');

    this.broadcastLobbyUpdate();
  }
}