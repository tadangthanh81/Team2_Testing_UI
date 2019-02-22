import { User } from './User';
import { inject } from '@angular/core/testing';


export class Category {

  id: number;
  categoryName: string;
  userCategory: User;
  dateCreated: Date;
  status: number;
}
