import React, { useState } from 'react';

export function CreateRoomModal({ isOpen, onClose, onSubmit, nickname }) {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      alert("방 제목을 입력해주세요!");
      return;
    }
    onSubmit(roomName);
    setRoomName("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>새 방 만들기</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label className="modal-label">방 제목</label>
            <input
              type="text"
              className="modal-input"
              placeholder="예) 축구 고수들의 대결"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              maxLength={30}
            />
            <p className="modal-hint">
              방장: <strong>{nickname}</strong>
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn confirm">
              방 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}