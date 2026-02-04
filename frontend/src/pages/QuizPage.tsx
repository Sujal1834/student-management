// import React from "react";
import React, { useEffect, useRef, useState } from "react";
import QuizList from "../components/quiz/QuizList";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizSubmit from "../components/quiz/QuizSubmit";
import QuizScore from "../components/quiz/QuizScore";
import { useQuiz } from "../hooks/useQuiz";
import "../styles/Quiz.css";

const QuizPage = () => {
  const {
    quizzes,
    selectedQuiz,
    questions,
    answers,
    score,
    issubmitted,
    error,
    selectQuiz,
    handleAnswerChange,
    handleSubmit,
    resetQuiz,
  } = useQuiz();
    
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
  if (!selectedQuiz || issubmitted) return;

  // time_limit is in minutes
  const totalSeconds = selectedQuiz.time_limit * 60;
  setTimeLeft(totalSeconds);

  timerRef.current = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current!);
        handleSubmit(); // 🔥 AUTO SUBMIT
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, [selectedQuiz, issubmitted]);

  return (
    <>
    <div className="quiz-container">
        <div style={{ padding: 20 }}>
        <h1>Student Quiz Section</h1>

        {!selectedQuiz && <QuizList quizzes={quizzes} selectQuiz={selectQuiz} error={error} />}

        {selectedQuiz && (
            <div>
            <button className="back-btn" onClick={() => {
            resetQuiz();
            if (timerRef.current) clearInterval(timerRef.current);
          }} style={{ marginTop: 20 }}>
                Back to Quiz List
            </button>
            <h2>{selectedQuiz.title}</h2>
            <p>{selectedQuiz.description}</p>

            <div className="quiz-time-wrapper">
            {selectedQuiz && !issubmitted && (
              <div className="quiz-timer">
                ⏳ Time Left:{" "}
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            )}
            </div>
           {!issubmitted && (<><QuizQuestion
                questions={questions}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
            />

            <QuizSubmit handleSubmit={handleSubmit} /></>)}
            <QuizScore score={score} />

            </div>
        )}
        </div>
    </div>
      </>
  );
};

export default QuizPage;
