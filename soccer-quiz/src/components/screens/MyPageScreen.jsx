import React, { useState } from 'react';
import { calculateAccuracy } from '../../utils/helpers';

export function MyPageScreen({ currentUser, onBack, onUpdateNickname, onUpdatePassword }) {
  const [newNickname, setNewNickname] = useState(currentUser?.nickname || "");
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  
  const totalSolved = currentUser?.totalSolved || 0;
  const totalCorrect = currentUser?.totalCorrect || 0;
  const accuracy = calculateAccuracy(totalSolved, totalCorrect);

  const handleNicknameUpdate = async () => {
    const result = await onUpdateNickname(newNickname);
    if (result.success) {
      alert('닉네임이 성공적으로 변경되었습니다!');
    } else {
      alert(result.message || '닉네임 변경에 실패했습니다.');
    }
  };

  const handlePasswordUpdate = async () => {
    const result = await onUpdatePassword(passwords.current, passwords.next);
    if (result.success) {
      alert('비밀번호가 안전하게 변경되었습니다.');
      setPasswords({ current: "", next: "" });
    } else {
      alert(result.message || '비밀번호 변경 실패');
    }
  };

  return (
    <div className="mypage-view-container">
      <div className="mypage-content-wrapper">
        <div className="mypage-header">
          <button className="back-link-btn" onClick={onBack}>← 돌아가기</button>
          <h2 className="mypage-title">내 정보 관리</h2>
          <div style={{ width: '100px' }}></div> 
        </div>

        <div className="edit-card stats-container">
          <label className="modal-label">나의 정보</label>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-label">푼 문제</span>
              <span className="stat-value">{totalSolved}개</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">정답률</span>
              <span className="stat-value highlight">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="edit-card">
          <label className="modal-label">닉네임 변경</label>
          <div className="input-group-vertical">
            <input 
              type="text" 
              className="modal-input" 
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="변경할 닉네임 입력"
            />
            <button 
              className="modal-btn confirm" 
              onClick={handleNicknameUpdate}
            >
              닉네임 저장
            </button>
          </div>
        </div>

        <div className="edit-card">
          <label className="modal-label">비밀번호 변경</label>
          <div className="input-group-vertical">
            <input 
              type="password" 
              className="modal-input" 
              placeholder="현재 비밀번호"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <input 
              type="password" 
              className="modal-input" 
              placeholder="새 비밀번호"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
            <button 
              className="modal-btn confirm"
              onClick={handlePasswordUpdate}
            >
              비밀번호 업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}