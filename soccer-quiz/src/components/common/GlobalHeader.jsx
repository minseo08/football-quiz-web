import React from 'react';

export function GlobalHeader({ currentUser, onMyPageClick, onLogout, isMyPageDisabled }) {
  return (
    <div className="global-header">
      <div className="header-right-area">
        <div className="user-menu-wrapper">
          <div className="nickname-display">
            {currentUser?.nickname} 님
          </div>
          <div className="user-dropdown">
            <button 
              className={`dropdown-item ${isMyPageDisabled ? 'btn-disabled' : ''}`} 
              onClick={isMyPageDisabled ? null : onMyPageClick}
              disabled={isMyPageDisabled}
              title={isMyPageDisabled ? "대기실/방 생성 중에는 이동할 수 없습니다" : ""}
            >
              마이페이지
            </button>
          </div>
        </div>
        <button className="logout-btn-small" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}