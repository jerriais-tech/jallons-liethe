import { createSlice } from "@reduxjs/toolkit";

import mefiete from "@/data/mefiete";
import { Course } from "@/data/types";

const initialState: Course[] = [mefiete];

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
});

export default coursesSlice.reducer;
