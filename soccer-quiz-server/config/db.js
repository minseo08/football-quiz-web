const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB 연결 성공!');
    
    await User.updateMany({}, { isOnline: false, currentSocketId: null });
    await mongoose.connection.collection('sessions').deleteMany({});
    console.log('유저 온라인 상태 초기화 완료');
  } catch (err) {
    console.error('MongoDB 연결 실패:', err);
    process.exit(1);
  }
};

module.exports = connectDB;