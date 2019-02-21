import { User } from './User';

export class Category {
  id: number;
  categoryName: string;
  userCategory: User;
  dateCreated: Date;
  status: number;
}
