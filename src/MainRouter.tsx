import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import LandingPage from "@/pages/Landing.tsx";
import Study from "@/pages/Study.tsx";
import Courses from "@/pages/Courses.tsx";
import Course from "@/pages/Course.tsx";
import Layout from "@/components/Layout";

const MainRouter: React.FC = () => (
  <BrowserRouter basename="/jallons-liethe">
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="study" element={<Study />} />
        <Route path="courses" element={<Courses />} />
        <Route path="course/:slug" element={<Course />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default MainRouter;
