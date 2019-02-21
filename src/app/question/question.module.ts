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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotifierModule } from 'angular-notifier';

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
    NgbModule.forRoot(),
    HttpClientModule,
    RouterModule,
    FormsModule,

    NotifierModule.withConfig({
      position: {
        horizontal: {
          /*
           //* Defines the horizontal position on the screen
           * @type {'left' | 'middle' | 'right'}
           */
          position: 'right',

          /**
           * Defines the horizontal distance to the screen edge (in px)
           //* @type {number}
           */
          distance: 20
        },

        vertical: {
          /**
           * Defines the vertical position on the screen
           //* @type {'top' | 'bottom'}
           */
          position: 'top',

          /**
           * Defines the vertical distance to the screen edge (in px)
           // * @type {number}
           */
          distance: 150,

          /**
           * Defines the vertical gap, existing between multiple notifications (in px)
           //* @type {number}
           */
          gap: 10
        }
      },
      behaviour: {
        /**
         * Defines whether each notification will hide itself automatically after a timeout passes
         //* @type {number | false}
         */
        autoHide: 3000,

        /**
         * Defines what happens when someone clicks on a notification
         //* @type {'hide' | false}
         */
        onClick: 'hide',

        /**
         * Defines what happens when someone hovers over a notification
         //* @type {'pauseAutoHide' | 'resetAutoHide' | false}
         */
        onMouseover: 'pauseAutoHide',

        /**
         * Defines whether the dismiss button is visible or not
         //* @type {boolean}
         */
        showDismissButton: true,

        /**
         * Defines whether multiple notification will be stacked, and how high the stack limit is
         //* @type {number | false}
         */
        stacking: 4
      }
    })
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
