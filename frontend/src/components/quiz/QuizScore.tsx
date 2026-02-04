import React from "react";

type Props = {
  score: number | null;
};

const QuizScore: React.FC<Props> = ({ score }) => (
  <>
    {score !== null && <h3 className="score-card">Your Score: {score}</h3>}
  </>
);

export default QuizScore;
