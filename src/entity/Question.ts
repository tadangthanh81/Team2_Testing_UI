import { Category } from './Category';
import { Level } from './Level';
import { Tag } from './Tag';
import { User } from './User';
import { Answer } from './Answer';
import { TypeQuestion } from './TypeQuestion';

export class Question {
  questionId: string;
  category: Category;
  content: string;
  questionType: TypeQuestion;
  questionLevel: Level;
  sugguestion: string;
  questionTag: Tag;
  status: number;
  dateCreated: Date;
  userQuestion: User;
  questionAnswer: Answer[];
}
