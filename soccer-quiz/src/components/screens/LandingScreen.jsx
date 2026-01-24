import React from 'react';
import { LoginModal } from '../auth/LoginModal';
import { RegisterModal } from '../auth/RegisterModal';

export function LandingScreen({
  showLoginModal,
  showRegisterModal,
  onShowLogin,
  onShowRegister,
  onCloseLogin,
  onCloseRegister,
  onLoginSuccess,
  onRegisterSuccess
}) {
  return (
    <div className="landing-screen">
      <LoginModal 
        isOpen={showLoginModal}
        onClose={onCloseLogin}
        onSuccess={onLoginSuccess}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={onCloseRegister}
        onSuccess={onRegisterSuccess}
      />
      <div className="hero-content">
        <h1 className="brand-logo">FOOTBALL MASTER</h1>
        <p className="hero-desc">당신의 축구 지식을 증명해보세요</p>
        <div className="auth-buttons">
          <button 
            className="main-action-btn" 
            onClick={onShowLogin}
          >
            로그인
          </button>
          <button 
            className="main-action-btn secondary" 
            onClick={onShowRegister}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}