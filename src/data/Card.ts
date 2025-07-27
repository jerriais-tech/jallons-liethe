import { md5 } from "js-md5";

import type {
  Assessment,
  AssessmentParams,
} from "@austinshelby/simple-ts-fsrs";

export interface CardData {
  front: string;
  back: string;
  assessment?: AssessmentParams;
  hash?: string;
  nextScheduledAssessment?: number;
}

export default class Card implements CardData {
  readonly front: string;
  readonly back: string;
  readonly assessment?: Assessment;
  readonly hash: string;
  readonly nextScheduledAssessment: number;

  constructor(front: string, back: string, assessment?: Assessment) {
    this.front = front;
    this.back = back;
    this.assessment = assessment;
    this.hash = md5(`${front}${back}`);
    this.nextScheduledAssessment =
      assessment?.nextScheduledAssessment.getTime() ?? new Date().getTime();
  }
}
