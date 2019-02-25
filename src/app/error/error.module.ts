import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { StWrongComponent } from './st-wrong/st-wrong.component';
import { ErrorHandlerService } from '../error-handler.service';
import { ErrorRoutingModule } from './error-routing1.module';
@NgModule({
  declarations: [NotFoundComponent, StWrongComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ],
  exports: [
    NotFoundComponent,
    StWrongComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ],
})
export class ErrorModule { }
