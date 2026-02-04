import axios from "axios";
import { Quiz, Question, QuizQuestionsResponse } from "../types/quiz";

const API = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");
const student_id = localStorage.getItem("login_id");

const headers = { Authorization: `Bearer ${token}` };

export const getQuizzes = async (): Promise<Quiz[]> => {
  const res = await axios.get(`${API}/quizzes/`, { headers });
  return res.data;
};

export const getQuizQuestions = async (quizId: number , student_id : number): Promise<QuizQuestionsResponse> => {
  const res = await axios.get(`${API}/quizzes/${quizId}/questions/`, { params:{student_id:student_id}, headers });
  return res.data;
};

export const submitAnswer = async (questionId: number, optionId: number) => {
  const student_id = localStorage.getItem("login_id");
  await axios.post(
    `${API}/answers/`,
    { student_id:student_id, question: questionId, selected_option: optionId },
    { headers }
  );
};

export const getQuizScore = async (quizId: number , student_id : number): Promise<number> => {
  const res = await axios.get(`${API}/quizzes/${quizId}/score/`, {params :{student_id : student_id}, headers });
  return res.data.score;
};
