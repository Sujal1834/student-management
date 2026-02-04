import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizManager } from "../hooks/useQuizmanager";
import QuizForm from "../components/quizmanager/QuizForm";
import QuizList from "../components/quizmanager/QuizList";
import QuestionList from "../components/quizmanager/QuestionList";
import "../styles/QuizManager.css";
import ConfirmToast from "../components/ConfirmToast";

const QuizManager = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const quiz = useQuizManager();
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [confirmQuiz,setConfirmQuiz] = useState<any | null>(null);

  // Sync selectedQuizId with URL param
  useEffect(() => {
    if (quizId) {
      quiz.setSelectedQuizId(Number(quizId)); // assuming ID is number
    } else {
      quiz.setSelectedQuizId(null);
    }
  }, [quizId]);

  // When selecting a quiz, update URL
  const handleSelectQuiz = (id: number) => {
    navigate(`/faculty/quiz/${id}`);
  };

  const handleBack = () => {
    quiz.setSelectedQuizId(null);
    navigate("/faculty/quiz"); // go back to quiz list
  };

  return (<>
    <div className="quiz-manager">
      <h2>Faculty Quiz Management</h2>

      {/* Create Quiz Button */}
      {!quiz.selectedQuizId && (
        <button className="primary-btn" onClick={() => setShowQuizForm(true)}>
          + Create Quiz
        </button>
      )}

      {/* Quiz List */}
      {!quiz.selectedQuizId && (
        <QuizList
          quizzes={quiz.quizzes}
          onSelect={handleSelectQuiz} // use new handler
          onDelete={quiz.removeQuiz}
          onConfirmToggle={(quizzes) => setConfirmQuiz(quizzes)}
        />
      )}

      {/* Quiz Form Modal */}
      {showQuizForm && (
        <div className="modal-overlay">
          <div className="modal">
            <QuizForm
              onSubmit={(data: any) => {
                quiz.addQuiz(data);
                setShowQuizForm(false);
              }}
              onCancel={() => setShowQuizForm(false)}
            />
          </div>
        </div>
      )}

      {/* Question Section */}
      {quiz.selectedQuizId && (
        <QuestionList
          questions={quiz.questions}
          onAddQuestion={quiz.addQuestion}
          onAddOption={quiz.addOption}
          onBack={handleBack} // use new handler
        />
      )}
    </div>
    {confirmQuiz && (
            <ConfirmToast
              message={`Are you sure you want to ${
                confirmQuiz.is_published ? "Unpublished" : "Published"
              }`
              //  ${confirmQuiz.name}?`
              }
              // isLoading={isLoading}
              onConfirm={async () => {
                // setIsLoading(true);
                try {
                  await quiz.toggleQuizStatus(
                    confirmQuiz.id,
                    confirmQuiz.is_published
                  );
                } finally {
                  // setIsLoading(false);
                  setConfirmQuiz(null);
                }
              }}
              onCancel={() => setConfirmQuiz(null)}
            />
          )}
          </>
  );
};

export default QuizManager;
