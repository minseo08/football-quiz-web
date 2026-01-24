import React from 'react';
import { TIME_LIMITS } from '../../constants/config';

export function TimerSelectScreen({ onSelectTime, onBack }) {
  return (
    <div className="timer-select-screen">
      <div className="timer-card">
        <h2 className="timer-title">제한 시간 선택</h2>
        <p className="timer-subtitle">한 문제당 주어지는 시간입니다.</p>
        <div className="timer-grid">
          {TIME_LIMITS.map(sec => (
            <button key={sec} className="timer-btn" onClick={() => onSelectTime(sec)}>
              <span className="timer-sec">{sec}</span>
              <span className="timer-unit">초</span>
            </button>
          ))}
        </div>
        <button className="cancel-btn" onClick={onBack}>뒤로가기</button>
      </div>
    </div>
  );
}
