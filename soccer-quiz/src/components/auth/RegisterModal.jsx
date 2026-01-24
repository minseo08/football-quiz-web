import React, { useState } from 'react';
import { authAPI } from '../../services/api';

export function RegisterModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.register(
        formData.username, 
        formData.password, 
        formData.nickname
      );

      if (data.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        onSuccess();
        onClose();
        setFormData({ username: '', password: '', confirmPassword: '', nickname: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>회원가입</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label className="modal-label">아이디</label>
              <input
                type="text"
                name="username"
                className="modal-input"
                placeholder="3-20자 영문, 숫자"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="modal-label">비밀번호</label>
              <input
                type="password"
                name="password"
                className="modal-input"
                placeholder="최소 6자 이상"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="modal-label">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                className="modal-input"
                placeholder="비밀번호 재입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="modal-label">닉네임</label>
              <input
                type="text"
                name="nickname"
                className="modal-input"
                placeholder="2-15자 (게임에서 표시될 이름)"
                value={formData.nickname}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={15}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn confirm" disabled={loading}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}