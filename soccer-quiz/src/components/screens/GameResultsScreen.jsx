import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';

export function GameResultsScreen({
  currentUser,
  gameResults,
  onLogout,
  onMyPageClick,
  onConfirm,
  onLeaveRoom
}) {
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
          <p className="results-subtitle">
            총 {gameResults.totalQuestions}문제 중 누가 최고일까요?
          </p>
        </div>
        
        <div className="podium-section">
          {gameResults.players
            .filter(player => player.rank <= 3) 
            .map((player) => {
              const podiumClass = player.rank === 1 ? 'first' : 
                                  player.rank === 2 ? 'second' : 'third';
              const medals = { 
                1: <img src="/gold.png" alt="아이콘" width="30" />, 
                2: <img src="/silver.png" alt="아이콘" width="30" />, 
                3: <img src="/bronze.png" alt="아이콘" width="30" />
              };
              
              return (
                <div key={player.playerId} className={`podium-item ${podiumClass}`}>
                  <div className="podium-medal">{medals[player.rank]}</div>
                  <div className="podium-player">
                    <div className="player-avatar-large">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="player-name-large">
                      {player.name}
                      {player.name === currentUser?.nickname && <span className="me-badge">나</span>}
                    </h3>
                    <div className="player-score-large">
                      <span className="score-number">{player.score}</span>
                      <span className="score-total">/ {gameResults.totalQuestions}</span>
                    </div>
                    <div className="player-rank">#{player.rank}위</div>
                  </div>
                  <div className={`podium-stand ${podiumClass}`}>
                    <span className="stand-rank">{player.rank}</span>
                  </div>
                </div>
              );
            })}
        </div>
        
        {gameResults.players.length > 3 && (
          <div className="other-players-section">
            <h3 className="section-subtitle">📋 전체 순위</h3>
            <div className="players-list">
              {gameResults.players.map((player) => (
                <div 
                  key={player.playerId} 
                  className={`player-row ${player.name === currentUser.nickname ? 'highlight' : ''}`}
                >
                  <div className="player-row-rank">#{player.rank}</div>
                  <div className="player-row-info">
                    <div className="player-row-avatar">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="player-row-name">
                      {player.name}
                      {player.name === currentUser?.nickname && <span className="me-tag-small">나</span>}
                    </span>
                  </div>
                  <div className="player-row-score">
                    <span className="score-value">{player.score}</span>
                    <span className="score-label">점</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button className="action-btn primary large" onClick={onConfirm}>
            확인
          </button>
          <button className="action-btn danger large" onClick={onLeaveRoom}>
            방 나가기
          </button>
        </div>
      </div>
    </div>
  );
}
