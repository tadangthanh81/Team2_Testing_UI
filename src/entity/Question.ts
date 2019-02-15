import { Category } from './Category';
import { Type } from './Type';
import { Level } from './Level';
import { Tag } from './Tag';
import { User } from './User';
import { Answer } from './Answer';

export class Question {
  id: string;
  questionCategory: Category;
  content: string;
  questionType: Type;
  questionLevel: Level;
  suggestion: string;
  questionTag: Tag;
  status: number;
  dateCreated: Date;
  userQuestion: User;
  questionAnswer: Answer[];
}
