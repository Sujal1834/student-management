import React from "react";

type Props = {
  handleSubmit: () => void;
};

const QuizSubmit: React.FC<Props> = ({ handleSubmit  }) => {
  return ( 
        <>
        <button className="submit-btn" onClick={handleSubmit} style={{  marginTop: 20, padding: "10px 20px" }}>
            Submit Quiz
        </button>

        </>
    )
};

export default QuizSubmit;
