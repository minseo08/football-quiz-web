import React from 'react';
import { GlobalHeader } from '../common/GlobalHeader';

export function ModeSelectScreen({ currentUser, onLogout, onMyPageClick, onSelectSolo, onSelectMulti }) {
  return (
    <div className="mode-select-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <div className="mode-content">
        <h1 className="mode-title">FOOTBALL MASTER</h1>
        <p className="mode-subtitle">플레이 모드를 선택하세요</p>
        
        <div className="mode-grid">
          <button className="mode-card solo" onClick={onSelectSolo}>
            <div className="mode-icon">
              <img src="/single.png" alt="아이콘" width="70" />
            </div>
            <h3 className="mode-name">솔로 모드</h3>
            <p className="mode-desc">혼자서 실력을 테스트하세요</p>
            <div className="mode-features">
              <span className="feature">✓ 자유로운 진행</span>
              <span className="feature">✓ 즉시 시작</span>
            </div>
          </button>

          <button className="mode-card multi" onClick={onSelectMulti}>
            <div className="mode-icon">
              <img src="/multi.png" alt="아이콘" width="70" />
            </div>
            <h3 className="mode-name">멀티 모드</h3>
            <p className="mode-desc">친구들과 실시간 대결을 해보세요</p>
            <div className="mode-features">
              <span className="feature">✓ 방 생성</span>
              <span className="feature">✓ 실시간 대결</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
