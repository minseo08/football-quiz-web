import React from 'react';

export function GlobalHeader({ currentUser, onMyPageClick, onLogout }) {
  return (
    <div className="global-header">
      <div className="header-right-area">
        <div className="user-menu-wrapper">
          <div className="nickname-display">
            {currentUser?.nickname} 님
          </div>
          <div className="user-dropdown">
            <button className="dropdown-item" onClick={onMyPageClick}>
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