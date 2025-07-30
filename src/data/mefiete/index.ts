import { parse } from "achilles-csv-parser";
import { Course } from "@/data/types";

import coverImage from "./images/cover.jpg";

import contnu from "./contnu.csv?raw";
import contnuImage from "./images/contnu.jpg";
import vioge from "./vioge.csv?raw";
import viogeImage from "./images/vioge.jpg";
import sauter from "./sauter.csv?raw";
import sauterImage from "./images/sauter.jpg";

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
    {
      id: "vioge",
      courseId: "mefiete",
      title: "Tchi qui d'meuthe à la Ruette à la Vioge?",
      vocabulary: parse(vioge),
      image: viogeImage,
    },
    {
      id: "sauter",
      courseId: "mefiete",
      title: "I' faut r'garder la brecque d'vant la sauter",
      vocabulary: parse(sauter),
      image: sauterImage,
    },
  ],
};

export default course;
