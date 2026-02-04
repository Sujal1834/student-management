export interface Quiz {
  id: number;
  title: string;
  description: string;
  total_marks: number;
  time_limit: number;
  is_published : boolean;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  marks: number;
}

export interface Option {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}
