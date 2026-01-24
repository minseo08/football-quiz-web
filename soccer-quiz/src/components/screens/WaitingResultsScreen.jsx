import React from 'react';

export function WaitingResultsScreen() {
  return (
    <div className="waiting-results-screen">
      <div className="waiting-content">
        <div className="loading-animation">
          <div className="trophy-icon">🏆</div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h2 className="waiting-title">결과 집계 중...</h2>
        <p className="waiting-subtitle">다른 플레이어들의 점수를 기다리고 있습니다</p>
      </div>
    </div>
  );
}