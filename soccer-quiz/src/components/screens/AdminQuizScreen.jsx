import React, { useState } from 'react';
import { GlobalHeader } from '../common/GlobalHeader';
import { quizAPI } from '../../services/api';
import { QUIZ_TYPE_LABELS } from '../../constants/config';

export function AdminQuizScreen({ currentUser, onLogout, onMyPageClick, onBack }) {
  const [formData, setFormData] = useState({
    type: 'logo',
    question: '',
    imageUrls: '',
    options: ['', '', '', ''],
    answer: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setMessage({ type: 'error', text: '문제를 입력해주세요.' });
      return false;
    }
    if (!formData.imageUrls.trim()) {
      setMessage({ type: 'error', text: '이미지 URL을 입력해주세요.' });
      return false;
    }
    if (!formData.answer.trim()) {
      setMessage({ type: 'error', text: '정답을 입력해주세요.' });
      return false;
    }
    
    if (formData.type === 'logo' || formData.type === 'stadium') {
      const hasEmptyOption = formData.options.some(opt => !opt.trim());
      if (hasEmptyOption) {
        setMessage({ type: 'error', text: '모든 선택지를 입력해주세요.' });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const imageUrlsArray = formData.imageUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url);

      const answerArray = formData.type === 'player'
            ? formData.answer.split(',').map(ans => ans.trim()).filter(ans => ans)
            : [formData.answer.trim()];

      const quizData = {
        type: formData.type,
        question: formData.question,
        imageUrls: imageUrlsArray,
        answer: answerArray
      };

      if (formData.type === 'logo' || formData.type === 'stadium') {
        quizData.options = formData.options.filter(opt => opt.trim());
      }

      const response = await quizAPI.createQuiz(quizData);

      if (response.success) {
        setMessage({ type: 'success', text: '퀴즈가 성공적으로 추가되었습니다!' });

        setFormData({
          type: 'logo',
          question: '',
          imageUrls: '',
          options: ['', '', '', ''],
          answer: ''
        });
      } else {
        setMessage({ type: 'error', text: response.message || '퀴즈 추가에 실패했습니다.' });
      }
    } catch (error) {
      console.error('퀴즈 추가 오류:', error);
      setMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-quiz-screen">
      <GlobalHeader 
        currentUser={currentUser}
        onMyPageClick={onMyPageClick}
        onLogout={onLogout}
      />
      <div className="admin-content">
        <div className="admin-header">
          <button className="back-link" onClick={onBack}>
            ← 모드 선택으로
          </button>
          <h2 className="admin-title">퀴즈 추가</h2>
          <p className="admin-subtitle">새로운 퀴즈 추가</p>
        </div>

        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="quiz-form">
            {message.text && (
              <div className={`message-box ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-section">
              <label className="form-label">퀴즈 유형 *</label>
              <select 
                className="form-select"
                value={formData.type}
                onChange={handleTypeChange}
              >
                {Object.entries(QUIZ_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <p className="form-hint">
                {formData.type === 'player' 
                  ? '주관식: 선택지 없이 직접 입력' 
                  : '객관식: 4개의 선택지 필요'}
              </p>
            </div>

            <div className="form-section">
              <label className="form-label">문제 *</label>
              <input
                type="text"
                name="question"
                className="form-input"
                placeholder="예) 이 팀의 이름은?"
                value={formData.question}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-section">
              <label className="form-label">이미지 URL *</label>
              <input
                type="text"
                name="imageUrls"
                className="form-input"
                placeholder="이미지 URL (여러 개는 쉼표로 구분)"
                value={formData.imageUrls}
                onChange={handleInputChange}
                required
              />
              <p className="form-hint">
                여러 이미지를 추가하려면 쉼표(,)로 구분하세요
              </p>
            </div>

            {(formData.type === 'logo' || formData.type === 'stadium') && (
              <div className="form-section">
                <label className="form-label">선택지 (4개) *</label>
                <div className="options-grid">
                  {formData.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      className="form-input"
                      placeholder={`선택지 ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="form-section">
              <label className="form-label">정답 *</label>
              <input
                type="text"
                name="answer"
                className="form-input"
                placeholder={formData.type === 'player' 
                  ? "예) 메시, 리오넬 메시" 
                  : "선택지 중 정답을 정확히 입력"}
                value={formData.answer}
                onChange={handleInputChange}
                required
              />
              <p className="form-hint">
                {formData.type === 'player' 
                  ? '여러 개의 정답을 인정하려면 쉼표(,)로 구분하세요' 
                  : '위 선택지 중 하나를 정확히 입력해주세요'}
              </p>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="action-btn secondary" 
                onClick={onBack}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="action-btn success"
                disabled={loading}
              >
                {loading ? '추가 중...' : '퀴즈 추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}