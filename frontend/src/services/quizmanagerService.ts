import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

/* QUIZ */
export const fetchQuizzes = () =>
  axios.get(`${BASE_URL}/faculty/quizzes/`);

export const createQuiz = (data: any) =>
  axios.post(`${BASE_URL}/faculty/quiz/create/`, data);

export const deleteQuiz = (id: number) =>
  axios.delete(`${BASE_URL}/quiz/${id}/delete/`);

/* QUESTION */
export const fetchQuestions = (quizId: number) =>
  axios.get(`${BASE_URL}/faculty/quizzes/${quizId}/questions/`);

export const createQuestion = (data: any) =>
  axios.post(`${BASE_URL}/faculty/question/create/`, data);

/* OPTION */
export const createOption = (data: any) =>
  axios.post(`${BASE_URL}/faculty/option/create/`, data);

export const gettoggleQuizStatus = async (id: number) => {
  return axios.patch(
    `${BASE_URL}/faculty/quizzes/${id}/toggle-status/`,
    {
      headers:{
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    }
  );
};