import React from "react";
import { Question } from "../../types/quiz";

type Props = {
  questions: Question[];
  answers: { [key: number]: number };
  handleAnswerChange: (questionId: number, optionId: number) => void;
};

const QuizQuestion: React.FC<Props> = ({ questions, answers, handleAnswerChange }) => (
  <div>
    {questions.map((q) => (
      <div className="question-card"
        key={q.id}
        style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
      >
        <p>
          <strong>{q.text}</strong> ({q.marks} marks)
        </p>
        {q.options.map((o) => (
          <label className="option-label" key={o.id} style={{ display: "block", margin: 5 }}>
            <input
              type="radio"
              name={`question-${q.id}`}
              value={o.id}
              checked={answers[q.id] === o.id}
              onChange={() => handleAnswerChange(q.id, o.id)}
            />
            {o.text}
          </label>
        ))}
      </div>
    ))}
  </div>
);

export default QuizQuestion;
