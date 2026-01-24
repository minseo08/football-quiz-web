import React, { useState } from 'react';
import { authAPI } from '../../services/api';

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    setLoading(true);

    try {
      const data = await authAPI.login(formData.username, formData.password);

      if (data.success) {
        onSuccess(data.user);
        onClose();
        setFormData({ username: '', password: '' });
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
          <h3>로그인</h3>
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
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="modal-label">비밀번호</label>
              <input
                type="password"
                name="password"
                className="modal-input"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn confirm" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}