import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListQuestionComponent } from './list-question/list-question.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ViewQuestionComponent } from './view-question/view-question.component';
import { IplistQuestionComponent } from './iplist-question/iplist-question.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PopupListQuestionComponent } from './list-question/popup-question.component';

@NgModule({
  declarations: [
    ListQuestionComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    ViewQuestionComponent,
    IplistQuestionComponent,
    PopupListQuestionComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule, MatCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    ListQuestionComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    ViewQuestionComponent,
    IplistQuestionComponent,
    PopupListQuestionComponent
  ]
})
export class QuestionModule { }
