import { Question } from './Question';

export class Answer {
  answerId: string;
  content: string;
  isTrue: number;
  status: number;
  question: Question;
}
