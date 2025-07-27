export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  image: string;
  vocabulary: { front: string; back: string }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  lessons: Lesson[];
}
