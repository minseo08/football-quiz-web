import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';
import { CreateRoomModal } from '../modals/CreateRoomModal';

export function LobbyScreen({
  currentUser,
  participants,
  roomList,
  showCreateRoomModal,
  onLogout,
  onMyPageClick,
  onBack,
  onShowCreateRoom,
  onCloseCreateRoom,
  onCreateRoom,
  onJoinRoom
}) {
  return (
    <div className="lobby-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={onCloseCreateRoom}
        onSubmit={onCreateRoom}
        nickname={currentUser?.nickname || '알 수 없음'}
      />

      <div className="lobby-content">
        <button className="back-link-lobby" onClick={onBack}>
          ← 모드 선택으로
        </button>
        <div className="lobby-header">
          <h2 className="lobby-title">멀티 모드</h2>
          <p className="lobby-subtitle">
            <span className="user-count">{participants.length}명</span> 대기 중
          </p>
        </div>
        
        <button className="create-room-btn" onClick={onShowCreateRoom}>
          <span className="btn-icon">➕</span>
          <span>방 만들기</span>
        </button>
        
        <div className="room-section">
          <h3 className="section-title">
            참여 가능한 방 <span className="count-badge">{roomList.length}개</span>
          </h3>
          
          {roomList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <img src="/noroom.png" alt="아이콘" width="70" />
              </div>
              <p className="empty-text">생성된 방이 없습니다</p>
              <p className="empty-hint">첫 번째 방을 만들어보세요!</p>
            </div>
          ) : (
            <div className="room-grid">
              {roomList.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <h3 className="room-name">{room.name}</h3>
                    {room.quizType && (
                      <span className="quiz-badge">
                        {room.quizType === 'logo' && <img src="/logo.png" alt="아이콘" width="20" />}
                        {room.quizType === 'player' && <img src="/player.png" alt="아이콘" width="20" />}
                        {room.quizType === 'stadium' && <img src="/stadium.png" alt="아이콘" width="20" />}
                      </span>
                    )}
                  </div>
                  <div className="room-card-body">
                    <div className="room-stats">
                      <span className="stat-item">
                        <span className="stat-icon"><img src="/single.png" alt="아이콘" width="30" /></span>
                        <span className="stat-value">{room.players.length}명</span>
                      </span>
                      {room.timeLimit && (
                        <span className="stat-item">
                          <span className="stat-icon"><img src="/clock.png" alt="아이콘" width="30" /></span>
                          <span className="stat-value">{room.timeLimit}초</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="join-room-btn" onClick={() => onJoinRoom(room.id)}>
                    입장하기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}