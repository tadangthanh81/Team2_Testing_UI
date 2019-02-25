import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { ListCategoryComponent } from './category-question/list-category/list-category.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/question' },
  { path: 'category', component: ListCategoryComponent},
  // { path: 'category', pathMatch: 'full', redirectTo: '/category' },
  // { path: 'error', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
