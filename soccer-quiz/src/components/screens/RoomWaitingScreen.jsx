import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';
import { TIME_LIMITS } from '../../constants/config';

export function RoomWaitingScreen({
  currentUser,
  currentRoom,
  socket,
  selectedQuizType,
  selectedTimeLimit,
  onLogout,
  onMyPageClick,
  onLeaveRoom,
  onToggleReady,
  onSelectQuizType,
  onSelectTimeLimit,
  onStartGame
}) {
  const isHost = currentRoom.host === socket?.id;
  
  const allReady = currentRoom.players
    .filter(p => p.id !== currentRoom.host)
    .every(p => p.isReady === true);
  
  const myStatus = currentRoom.players.find(p => p.id === socket?.id);
  
  const canStart = isHost && 
                   allReady && 
                   currentRoom.players.length >= 2 && 
                   selectedQuizType !== null;

  return (
    <div className="waiting-room-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <div className="room-container">
        <div className="room-header">
          <h2 className="room-title">{currentRoom.name}</h2>
          <span className="room-id">방 ID: {currentRoom.id.slice(-6)}</span>
        </div>

        <div className="players-section">
          <h3 className="section-title">
            참가자 <span className="count-badge">{currentRoom.players.length}명</span>
          </h3>
          <div className="player-grid">
            {currentRoom.players.map(p => (
              <div 
                key={p.id} 
                className={`player-card ${p.isReady ? 'ready' : ''} ${p.id === socket?.id ? 'me' : ''}`}
              >
                <div className="player-avatar">
                  {p.id === currentRoom.host ? 
                    <img src="/boss.png" alt="아이콘" width="30" /> : 
                    <img src="/noboss.png" alt="아이콘" width="30" />
                  }
                </div>
                <div className="player-info">
                  <p className="player-name">
                    {p.name}
                    {p.id === socket?.id && <span className="me-tag">나</span>}
                  </p>
                  <div className={`player-status ${p.isReady ? 'ready' : 'waiting'}`}>
                    {p.id === currentRoom.host ? "방장" : (p.isReady ? "준비완료" : "대기중")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <div className="quiz-settings-section">
            <h3 className="section-title">게임 설정</h3>
            
            <div className="setting-group">
              <label className="setting-label">퀴즈 유형</label>
              <div className="quiz-type-grid">
                {[
                  { type: 'logo', icon: <img src="/logo.png" alt="아이콘" width="30" />, name: '팀 로고 맞추기' },
                  { type: 'player', icon: <img src="/player.png" alt="아이콘" width="30" />, name: '선수 맞추기' },
                  { type: 'stadium', icon: <img src="/stadium.png" alt="아이콘" width="30" />, name: '경기장 맞추기' }
                ].map(({ type, icon, name }) => (
                  <button
                    key={type}
                    className={`quiz-type-card ${selectedQuizType === type ? 'selected' : ''}`}
                    onClick={() => onSelectQuizType(type)}
                  >
                    <span className="type-icon">{icon}</span>
                    <span className="type-name">{name}</span>
                    {selectedQuizType === type && <span className="check-mark">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {selectedQuizType && (
              <div className="setting-group">
                <label className="setting-label">문제당 제한 시간</label>
                <div className="time-limit-grid">
                  {TIME_LIMITS.map(time => (
                    <button
                      key={time}
                      className={`time-card ${selectedTimeLimit === time ? 'selected' : ''}`}
                      onClick={() => onSelectTimeLimit(time)}
                    >
                      <span className="time-value">{time}</span>
                      <span className="time-unit">초</span>
                      {selectedTimeLimit === time && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedQuizType && selectedTimeLimit && (
              <div className="settings-summary">
                <p className="summary-text">
                  <strong>
                    {selectedQuizType === 'logo' ? '팀 로고' : 
                     selectedQuizType === 'player' ? '선수 맞추기' : '경기장'}
                  </strong> 퀴즈 · 문제당 <strong>{selectedTimeLimit}초</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {!isHost && currentRoom.quizType && (
          <div className="quiz-settings-section guest">
            <h3 className="section-title">게임 설정</h3>
            <div className="settings-display">
              <div className="setting-item">
                <span className="setting-text">
                  {currentRoom.quizType === 'logo' ? (
                    <>
                      <img src="/logo.png" alt="아이콘" width="25" style={{ marginRight: '10px' }} />
                      팀 로고 맞추기
                    </>
                  ) : currentRoom.quizType === 'player' ? (
                    <>
                      <img src="/player.png" alt="아이콘" width="25" style={{ marginRight: '10px' }} />
                      선수 맞추기
                    </>
                  ) : (
                    <>
                      <img src="/stadium.png" alt="아이콘" width="25" style={{ marginRight: '10px' }} />
                      경기장 맞추기
                    </>
                  )}
                </span>
              </div>
              {currentRoom.timeLimit && (
                <div className="setting-item">
                  <span className="setting-icon"><img src="/clock.png" alt="아이콘" width="30" /></span>
                  <span className="setting-text">문제당 {currentRoom.timeLimit}초</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="room-actions">
          {isHost ? (
            <button 
              className={`action-btn primary ${canStart ? '' : 'disabled'}`}
              disabled={!canStart}
              onClick={onStartGame}
            >
              {!selectedQuizType 
                ? "⚠️ 퀴즈 유형을 선택하세요" 
                : currentRoom.players.length < 2 
                ? "⚠️ 최소 2명 필요" 
                : !allReady 
                ? "다른 플레이어 준비 대기 중..." 
                : "게임 시작하기"}
            </button>
          ) : (
            <button 
              className={`action-btn ${myStatus?.isReady ? 'success' : 'secondary'}`}
              onClick={onToggleReady}
            >
              {myStatus?.isReady ? "준비 취소" : "준비 완료"}
            </button>
          )}
          
          <button className="action-btn danger" onClick={onLeaveRoom}>
            방 나가기
          </button>
        </div>
      </div>
    </div>
  );
}