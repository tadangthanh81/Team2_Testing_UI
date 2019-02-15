import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { QuestionRoutingModule } from '../question/question-routing.module';
import { CategoryRoutingModule } from '../category-question/category-routing.module';

@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    RouterModule,
    QuestionRoutingModule,
    CategoryRoutingModule
  ],
  exports: [NavComponent]
})
export class NavModule { }
