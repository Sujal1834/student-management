export type Option = {
  id: number;
  text: string;
};

export type Question = {
  id: number;
  text: string;
  marks: number;
  options: Option[];
};

export type Quiz = {
  id: number;
  title: string;
  description: string;
  time_limit : number;
};

export type QuizSubmittedResponse = {
  submitted: true;
  score: number;
  quiz_id: number;
};

export type QuizQuestionsResponse = {
  submitted: boolean;
  score: number | null;
  questions: Question[];
};

export type Answers = {
  [questionId: number]: number;
};
