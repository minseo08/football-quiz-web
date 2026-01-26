import React from 'react';

export function PlayScreen({ 
  filteredQuizzes, 
  currentStep, 
  timeLeft, 
  userInput, 
  setUserInput, 
  onAnswer 
}) {
  const currentQuiz = filteredQuizzes[currentStep];
  
  return (
    <div className="play-screen">
      <div className="quiz-container">
        <div className="quiz-header">
          <span className="step-badge">{currentStep + 1} / {filteredQuizzes.length}</span>
          <div className={`timer-display ${timeLeft <= 2 ? 'warning' : ''}`}>
            남은 시간: <strong>{timeLeft}</strong>초
          </div>
        </div>
        
        <img src={currentQuiz.imageUrls[0]} alt="Quiz" className="quiz-image" />
        <h3 className="question-text">{currentQuiz.question}</h3>
        
        {['logo', 'stadium'].includes(currentQuiz.type?.toLowerCase().trim()) ? (
          <div className="options-grid">
            {currentQuiz.options?.map(opt => (
              <button key={opt} className="opt-btn" onClick={() => onAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="input-group">
            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && onAnswer(userInput)} 
              placeholder="정답 입력" 
              autoFocus
            />
            <button className="submit-btn" onClick={() => onAnswer(userInput)}>제출</button>
          </div>
        )}
      </div>
    </div>
  );
}