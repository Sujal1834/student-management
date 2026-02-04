export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: number;
  student_id: number;
  file?: string;
  created_at: string;

  // optional (for UI convenience)
  course_name?: string;
  student_name?: string;
}
