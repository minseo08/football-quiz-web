const express = require('express');
const router = express.Router();
const User = require('../models/User')

// 회원가입
router.post('/register', async (req, res) => {
    try {
      const { username, password, nickname } = req.body;
  
      if (!username || !password || !nickname) {
        return res.status(400).json({ 
          success: false, 
          message: '모든 필드를 입력해주세요.' 
        });
      }
  
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ 
          success: false, 
          message: '아이디는 3-20자여야 합니다.' 
        });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: '비밀번호는 최소 6자 이상이어야 합니다.' 
        });
      }
  
      if (nickname.length < 2 || nickname.length > 15) {
        return res.status(400).json({ 
          success: false, 
          message: '닉네임은 2-15자여야 합니다.' 
        });
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: '이미 존재하는 아이디입니다.' 
        });
      }
  
      const existingNickname = await User.findOne({ nickname });
      if (existingNickname) {
        return res.status(400).json({ 
          success: false, 
          message: '이미 사용 중인 닉네임입니다.' 
        });
      }
  
      const user = new User({
        username,
        password,
        nickname
      });
  
      await user.save();
  
      console.log(`회원가입 성공: ${username} (${nickname})`);
  
      res.json({ 
        success: true, 
        message: '회원가입이 완료되었습니다.' 
      });
  
    } catch (error) {
      console.error('회원가입 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      });
    }
  });
  
// 로그인
router.post('/login', async (req, res) => {
try {
    const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({ 
        success: false, 
        message: '아이디와 비밀번호를 입력해주세요.' 
    });
    }

    const user = await User.findOne({ username });
    if (!user) {
    return res.status(401).json({ 
        success: false, 
        message: '아이디 또는 비밀번호가 잘못되었습니다.' 
    });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
    return res.status(401).json({ 
        success: false, 
        message: '아이디 또는 비밀번호가 잘못되었습니다.' 
    });
    }

    if (user.isOnline) {
    return res.status(403).json({ 
        success: false, 
        message: '이미 다른 곳에서 로그인 중입니다.' 
    });
    }

    await User.findByIdAndUpdate(user._id, {
        isOnline: true
      });

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.nickname = user.nickname;

    console.log(`로그인 성공: ${username} (${user.nickname})`);

    res.json({ 
    success: true, 
    user: {
        username: user.username,
        nickname: user.nickname
    }
    });

} catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
    success: false, 
    message: '서버 오류가 발생했습니다.' 
    });
}
});

// 로그아웃
router.post('/logout', async (req, res) => {
try {
    if (req.session.userId) {
    await User.findByIdAndUpdate(req.session.userId, {
        isOnline: false,
        currentSocketId: null
    });

    console.log(`로그아웃: ${req.session.username}`);
    }

    req.session.destroy();
    res.json({ success: true });

} catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({ 
    success: false, 
    message: '로그아웃 중 오류가 발생했습니다.' 
    });
}
});

// 닉네임 업데이트
router.post('/update-nickname', async (req, res) => {
  try {
    const { nickname } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    if (!nickname || nickname.length < 2 || nickname.length > 15) {
      return res.status(400).json({ success: false, message: "닉네임은 2-15자여야 합니다." });
    }

    const existingNickname = await User.findOne({ nickname, _id: { $ne: userId } });
    if (existingNickname) {
      return res.status(400).json({ success: false, message: "이미 사용 중인 닉네임입니다." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { nickname }, { new: true });

    req.session.nickname = updatedUser.nickname;

    console.log(`닉네임 변경 성공: ${req.session.username} -> ${nickname}`);
    res.json({ success: true, message: "닉네임이 성공적으로 변경되었습니다." });

  } catch (error) {
    console.error('닉네임 업데이트 오류:', error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 비밀번호 업데이트
router.post('/update-password', async (req, res) => {
  try {
    const { currentPassword, nextPassword } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    if (!currentPassword || !nextPassword || nextPassword.length < 6) {
      return res.status(400).json({ success: false, message: "새 비밀번호는 최소 6자 이상이어야 합니다." });
    }

    const user = await User.findById(userId);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
    }

    user.password = nextPassword;
    await user.save();

    console.log(`비밀번호 변경 완료: ${user.username}`);
    res.json({ success: true, message: "비밀번호가 안전하게 변경되었습니다." });

  } catch (error) {
    console.error('비밀번호 업데이트 오류:', error);
    res.status(500).json({ success: false, message: "비밀번호 변경 중 오류가 발생했습니다." });
  }
});

// 세션 확인
router.get('/check', async (req, res) => {
if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) {
    res.json({ 
        authenticated: true, 
        user: {
        username: user.username,
        nickname: user.nickname
        }
    });
    } else {
    res.json({ authenticated: false });
    }
} else {
    res.json({ authenticated: false });
}
});

module.exports = router;