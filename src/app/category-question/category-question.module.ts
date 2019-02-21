import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent} from './list-category/list-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryRoutingModule } from './category-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatCheckboxModule, MatSortModule } from '@angular/material';


@NgModule({
  declarations: [ListCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    MatSortModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatTableModule
  ],
  exports:[
    ListCategoryComponent,
  ],
})
export class CategoryQuestionModule { }
