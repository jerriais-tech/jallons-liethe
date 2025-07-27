export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  image: string;
  vocabulary: { jerriais: string; english: string }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  lessons: Lesson[];
}
