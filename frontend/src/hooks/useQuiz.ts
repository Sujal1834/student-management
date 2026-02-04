import { useState, useEffect, useRef } from "react";
import { Quiz, Question, Answers } from "../types/quiz";
import * as quizService from "../services/quizService";

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState<number | null>(null);
  const [issubmitted, setIssubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("")
  const student_id : number = Number(localStorage.getItem("login_id"))
  const answersRef = useRef<Answers>({});

  // Fetch quizzes on mount
  useEffect(() => {
    quizService.getQuizzes().then(setQuizzes).catch((error) => {
        console.log(error.response?.data?.error)
        setError(error.response?.data?.error)
    });;
  }, []);

//   const selectQuiz = (quiz: Quiz) => {
//     quizService.getQuizQuestions(quiz.id,student_id)
//       .then((q) => {
//         setSelectedQuiz(quiz);
//         setQuestions(q);
//         setAnswers({});
//         setScore(null);
//       })
//       .catch(console.error);
//   };

const selectQuiz = async (quiz: Quiz) => {
  try {
    const res = await quizService.getQuizQuestions(quiz.id, student_id);

    setSelectedQuiz(quiz);
    setAnswers({});
    answersRef.current = {};

    if ("submitted" in res && res.submitted) {
      // ✅ Quiz already submitted
      setIssubmitted(true);
      setScore(res.score);
      setQuestions([]);
      setAnswers({});
    } else {
      // ✅ Quiz not submitted
      setIssubmitted(false);
      setQuestions(res.questions);
      setAnswers({});
      setScore(null);
    }
  } catch (err) {
    console.error(err);
  }
};

  // const handleAnswerChange = (questionId: number, optionId: number) => {
  //   setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  // };
  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionId };
      answersRef.current = updated; // 🔥 keep ref updated
      return updated;
    });
  };

  // const handleSubmit = async () => {
  //   try {
  //     for (const [questionId, optionId] of Object.entries(answers)) {
  //       if(selectedQuiz)
  //       await quizService.submitAnswer(Number(questionId), optionId);
  //     }
  //     const s = selectedQuiz ? await quizService.getQuizScore(selectedQuiz.id,student_id) : null;
  //     setScore(s);
  //     setIssubmitted(true)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async () => {
  try {
    const currentAnswers = answersRef.current;

    for (const [questionId, optionId] of Object.entries(currentAnswers)) {
      if (selectedQuiz) {
        await quizService.submitAnswer(Number(questionId), optionId);
      }
    }

    const s = selectedQuiz
      ? await quizService.getQuizScore(selectedQuiz.id, student_id)
      : null;

    setScore(s);
    setIssubmitted(true);
  } catch (err) {
    console.error(err);
  }
};

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setAnswers({});
    answersRef.current = {};
  }

  return {
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
  };
};
