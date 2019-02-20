import { Category } from './Category';
import { Level } from './Level';
import { Tag } from './Tag';
import { User } from './User';
import { Answer } from './Answer';
import { TypeQuestion } from './TypeQuestion';

export class Question {
  id: string;
  questionCategory: Category;
  content: string;
  questionType: TypeQuestion;
  questionLevel: Level;
  suggestion: string;
  questionTag: Tag;
  status: number;
  dateCreated: Date;
  userQuestion: User;
  questionAnswer: Answer[];
}
