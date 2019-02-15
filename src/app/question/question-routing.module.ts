import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQuestionComponent } from './list-question/list-question.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ViewQuestionComponent } from './view-question/view-question.component';
import { IplistQuestionComponent } from './iplist-question/iplist-question.component';

const routes: Routes = [
  {
    path: 'question',
    children: [
      {
        path: '',
        component: ListQuestionComponent,
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateQuestionComponent
      },
      {
        path: 'importlist',
        component: IplistQuestionComponent
      },
      {
        path: ':id',
        component: ViewQuestionComponent
      },
      {
        path: ':id/edit',
        component: EditQuestionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRoutingModule { }
