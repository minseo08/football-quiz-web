require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const socketHandler = require('./sockets/gameHandler');

const app = express();
const server = http.createServer(app);

connectDB();

// 통합 세션 설정
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000 
  }
});

// 미들웨어 순서 (CORS -> Session -> JSON)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API 라우팅
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

// Socket.IO 설정 및 세션 공유
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`퀴즈 서버가 ${PORT}에서 실행 중!`);
});