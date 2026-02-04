import { useState } from "react";
import QuestionForm from "./QuestionForm";
import OptionForm from "./OptionForm";

const QuestionList = ({ questions, onAddQuestion, onAddOption, onBack }: any) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeOptionQuestionId, setActiveOptionQuestionId] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0)

  console.log(questions)
  return (
    <div className="question-page">
      {/* Header */}
      <div className="question-page-header">
        <h3>Questions</h3>

        <div className="question-header-actions">
          <button className="secondary" onClick={onBack}>
            ← Back
          </button>
          <button onClick={() => setShowQuestionForm(true)}>
            + Add Question
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      {/* {showQuestionForm && (
        <div className="question-form-wrapper">
          <QuestionForm
            onSubmit={(text: string, marks: number) => {
              onAddQuestion(text, marks);
              setShowQuestionForm(false);
            }}
          />
        </div>
      )} */}
      {showQuestionForm && (
        <div className="modal-overlay">
          <div className="modal">
            <QuestionForm
              onSubmit={(text: string, marks: number) => {
                onAddQuestion(text, marks);
                setShowQuestionForm(false);
              }}
            />
            <button
              className="secondary"
              style={{ marginTop: "10px" }}
              onClick={() => setShowQuestionForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeOptionQuestionId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <OptionForm
              questionId={activeOptionQuestionId}
              onSubmit={(questionId: number, text: string, is_correct: boolean) => {
                onAddOption(questionId, text, is_correct);
                setActiveOptionQuestionId(null); // close modal after adding
              }}
              onCancel={() => setActiveOptionQuestionId(null)}
            />
          </div>
        </div>
      )}

      {/* Question Table */}
      <div className="question-table">
        <div className="question-table-header">
          <span>Question</span>
          <span>Marks</span>
          <span>Options</span>
          <span>Action</span>
        </div>

        
        {questions.map((q: any, index: number) => (
          <div className="question-table-row" key={q.id}>
            <span>{index + 1}. {q.text}</span>
            <span>{q.marks}</span>
            <span className="question-options">
            {console.log("length : ",q.options.length)}
            {q.options.map((o : any) => (<>
                <span className={o.is_correct ? "correct-answer" : "wrong-answer"}>{o.text}</span>
                </>
            ))}</span>
            <span>{q.options.length < 4 ? <button onClick={() => setActiveOptionQuestionId(q.id)}>Add Option</button>:<span>Maximum 4 options reached</span>}</span>
            {/* <div className="option-column">
              <OptionForm
                questionId={q.id}
                onSubmit={onAddOption}
              />
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
