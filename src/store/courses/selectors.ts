import { RootState } from "../index";
import { useAppSelector } from "../hooks";

export const selectCourses = (state: RootState) => state.courses;
export const useCourses = () => useAppSelector(selectCourses);
