import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { StWrongComponent } from './st-wrong/st-wrong.component';

const routes: Routes = [
    { 
        path: 'error', 
        pathMatch: 'full',
        children: [
            {
                path: '404',
                component: NotFoundComponent
            },
            {
                path: '500',
                component: StWrongComponent
            }
        ]
     },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ErrorRoutingModule { }