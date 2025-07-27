import { parse } from "achilles-csv-parser";
import { Course } from "@/data/types";

import coverImage from "./images/cover.jpg";

import contnu from "./contnu.csv?raw";
import contnuImage from "./images/contnu.jpg";

const course: Course = {
  id: "mefiete",
  title: "Mêfie-té des Monstres!",
  subtitle: "Tchiques légendes dé Jèrri",
  image: coverImage,
  lessons: [
    {
      id: "lecontnu",
      courseId: "mefiete",
      title: "Lé Cont'nu",
      vocabulary: parse(contnu),
      image: contnuImage,
    },
  ],
};

export default course;
