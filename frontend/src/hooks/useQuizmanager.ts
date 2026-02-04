import { useEffect, useState } from "react";
import {
  fetchQuizzes,
  createQuiz,
  deleteQuiz,
  fetchQuestions,
  createQuestion,
  createOption,
  gettoggleQuizStatus,
} from "../services/quizmanagerService";
import { Quiz, Question } from "../types/quizmanager";

export const useQuizManager = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadQuizzes = async () => {
    setLoading(true);
    const res = await fetchQuizzes();
    setQuizzes(res.data);
    setLoading(false);
  };

  const addQuiz = async (data: any) => {
    await createQuiz(data);
    loadQuizzes();
  };

  const removeQuiz = async (id: number) => {
    await deleteQuiz(id);
    setSelectedQuizId(null);
    setQuestions([]);
    loadQuizzes();
  };

  const loadQuestions = async (quizId: number) => {
    const res = await fetchQuestions(quizId);
    setQuestions(res.data);
  };

  const addQuestion = async (text: string, marks: number) => {
    if (!selectedQuizId) return;
    await createQuestion({
      quiz_id: selectedQuizId,
      text,
      marks,
    });
    loadQuestions(selectedQuizId);
  };

  const addOption = async (
    questionId: number,
    text: string,
    isCorrect: boolean
  ) => {
    if (!selectedQuizId) return;
    await createOption({
      question_id: questionId,
      text,
      is_correct: isCorrect,
    });
    loadQuestions(selectedQuizId);
  };

  const toggleQuizStatus = async (
      id: number,
      currentStatus: boolean
      ) => {
        await gettoggleQuizStatus(id);
  
        // optimistic UI update
        setQuizzes((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, is_published: !currentStatus } : s
          )
        );
      };

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) loadQuestions(selectedQuizId);
  }, [selectedQuizId]);

  return {
    quizzes,
    questions,
    loading,
    selectedQuizId,
    toggleQuizStatus,
    setSelectedQuizId,
    addQuiz,
    removeQuiz,
    addQuestion,
    addOption,
  };
};
