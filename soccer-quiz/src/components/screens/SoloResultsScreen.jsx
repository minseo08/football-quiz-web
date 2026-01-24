import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';

export function SoloResultsScreen({ currentUser, soloResults, onLogout, onMyPageClick, onConfirm }) {
  return (
    <div className="game-results-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <div className="results-container">
        <div className="results-header">
          <h1 className="results-title">퀴즈 결과</h1>
          <p className="results-subtitle">당신의 기록을 확인하세요</p>
        </div>

        <div className="solo-result-card">
          <div className="result-score-circle">
            <span className="current">{soloResults.score}</span>
            <span className="divider">/</span>
            <span className="total">{soloResults.total}</span>
          </div>
          <p className="result-comment">
            {soloResults.score === soloResults.total ? "완벽합니다!" : 
            soloResults.score > soloResults.total / 2 ? "제법인데요?" : 
            "조금 더 연습해볼까요?"}
          </p>
        </div>

        <div className="results-actions">
          <button className="action-btn large" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
