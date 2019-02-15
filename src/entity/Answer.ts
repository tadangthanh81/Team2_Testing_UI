import { Question } from './Question';

export class Answer {
  id: string;
  content: string;
  isTrue: number;
  status: number;
  question: Question;
}
