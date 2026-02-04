import React from "react";
import { Quiz } from "../../types/quiz";

type Props = {
  quizzes: Quiz[];
  selectQuiz: (quiz: Quiz) => void;
  error : string
};

const QuizList: React.FC<Props> = ({ quizzes, selectQuiz, error }) => (
  
  <div>
    {error && <h2>{error}</h2>}
    {!error && <h2>Select a Quiz</h2>}
    {quizzes.map((q) => (
      <button className="quiz-select-btn" key={q.id} onClick={() => selectQuiz(q)} style={{ display: "block", margin: 10 }}>
        {q.title}
      </button>
    ))}
  </div>
);

export default QuizList;
