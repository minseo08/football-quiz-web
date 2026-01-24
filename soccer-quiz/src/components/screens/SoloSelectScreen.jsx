import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';

export function SoloSelectScreen({ currentUser, isLoading, onLogout, onMyPageClick, onBack, onSelectQuizType }) {
  return (
    <div className="solo-select-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <div className="solo-content">
        <div className="solo-header">
          <button className="back-link" onClick={onBack}>
            ← 모드 선택으로
          </button>
          <h2 className="solo-title">솔로 모드</h2>
          <p className="solo-subtitle">도전할 퀴즈 유형을 선택하세요</p>
        </div>

        <div className="quiz-select-grid">
          <button 
            className="quiz-select-card logo"
            onClick={() => onSelectQuizType('logo')}
            disabled={isLoading}
          >
            <div className="quiz-select-icon">
              <img src="/logo.png" alt="아이콘" width="70" />
            </div>
            <h3 className="quiz-select-name">팀 로고 맞추기</h3>
            <p className="quiz-select-desc">세계 각국의 팀 로고를 보고 팀명을 맞춰보세요</p>
            <div className="quiz-select-footer">
              <span className="difficulty medium">객관식</span>
              <span className="arrow">→</span>
            </div>
          </button>

          <button 
            className="quiz-select-card player"
            onClick={() => onSelectQuizType('player')}
            disabled={isLoading}
          >
            <div className="quiz-select-icon">
              <img src="/player.png" alt="아이콘" width="70" />
            </div>
            <h3 className="quiz-select-name">선수 맞추기</h3>
            <p className="quiz-select-desc">사진을 보고 축구 선수의 이름을 맞춰보세요</p>
            <div className="quiz-select-footer">
              <span className="difficulty hard">주관식</span>
              <span className="arrow">→</span>
            </div>
          </button>

          <button 
            className="quiz-select-card stadium"
            onClick={() => onSelectQuizType('stadium')}
            disabled={isLoading}
          >
            <div className="quiz-select-icon">
              <img src="/stadium.png" alt="아이콘" width="70" />
            </div>
            <h3 className="quiz-select-name">경기장 맞추기</h3>
            <p className="quiz-select-desc">유명 경기장 사진을 보고 이름을 맞춰보세요</p>
            <div className="quiz-select-footer">
              <span className="difficulty medium">객관식</span>
              <span className="arrow">→</span>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>퀴즈 데이터를 불러오는 중...</p>
          </div>
        )}
      </div>
    </div>
  );
}