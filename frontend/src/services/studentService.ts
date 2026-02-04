import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getStudents = (page: number, token: string) =>
  axios.get(`${API}/student/page/?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const searchStudents = (params: {
  name?: string;
  course_id?: string | number;
}) => {
  let url = `${API}/student/search/?`;

  if (params.name) url += `name=${encodeURIComponent(params.name)}&`;
  if (params.course_id) url += `course_id=${params.course_id}&`;

  return fetch(url).then(res => res.json());
};

export const gettoggleStudentStatus = async (id: number) => {
  return axios.patch(
    `${API}/student/${id}/toggle-status/`,
    {},
    {
      headers:{
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    }
  );
};

export const updateStudentCount = async (id: number) => {
  return axios.patch(
    `${API}/student/${id}/count/`,
    {
      headers:
      {   Authorization: `Bearer ${localStorage.getItem("access_token")}`   }
    }
  );
};

