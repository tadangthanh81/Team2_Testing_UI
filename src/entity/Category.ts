import { User } from './User';

export class Category {
  id: string;
  categoryName: string;
  userCategory: User;
  dateCreated: Date;
  status: number;
}
