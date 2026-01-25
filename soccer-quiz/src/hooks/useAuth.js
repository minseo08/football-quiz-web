import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await authAPI.checkAuth();
      
      if (data.authenticated) {
        setCurrentUser(data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('인증 확인 오류:', error);
      return null;
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async (onLogoutCallback) => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
      onLogoutCallback?.();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleUpdateNickname = async (newNickname) => {
    if (!newNickname.trim()) {
      return { success: false, message: "닉네임을 입력해주세요." };
    }

    try {
      const data = await authAPI.updateNickname(newNickname);
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, nickname: newNickname }));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Update Nickname Error:', err);
      return { success: false, message: '서버와 통신할 수 없습니다.' };
    }
  };

  const handleUpdatePassword = async (currentPassword, nextPassword) => {
    if (!currentPassword || !nextPassword) {
      return { success: false, message: "비밀번호를 모두 입력해주세요." };
    }
    if (nextPassword.length < 6) {
      return { success: false, message: "새 비밀번호는 6자 이상이어야 합니다." };
    }

    try {
      const data = await authAPI.updatePassword(currentPassword, nextPassword);
      if (data.success) {
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Update Password Error:', err);
      return { success: false, message: '서버와 통신할 수 없습니다.' };
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };
  
  const handleUpdateStats = async (correctCount, totalCount) => {
    try {
      const data = await authAPI.updateStats(correctCount, totalCount);
      if (data.success) {
        setCurrentUser(prev => ({
          ...prev,
          totalSolved: data.stats.totalSolved,
          totalCorrect: data.stats.totalCorrect
        }));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Update Stats Error:', err);
      return { success: false, message: '통계 업데이트 실패' };
    }
  };
  return {
    currentUser,
    isAuthChecking,
    handleLoginSuccess,
    handleLogout,
    handleUpdateNickname,
    handleUpdatePassword,
    handleUpdateStats,
    checkAuth
  };
};