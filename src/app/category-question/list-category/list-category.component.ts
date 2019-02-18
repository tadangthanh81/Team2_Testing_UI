import { Component, OnInit } from '@angular/core';
import { Category } from 'src/entity/Category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  categorys: Category[] = [];
  categoryFrm: FormGroup;
  categoryFrm2: FormGroup;
  category1: Category;
  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.reloadData();
    this.validate();

  }

  reloadData() {
    this.service.getCategoryList()
      .subscribe(categorys => {
        this.categorys = categorys;
        console.log(this.categorys);
      })
  }

  validate() {
    this.categoryFrm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]],
      userIdCreated: ['', [Validators.required]],
      dateCreated: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.categoryFrm2 = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]],
      userIdCreated: ['', [Validators.required]],
      dateCreated: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  onCreate() {
    console.log(this.categoryFrm.value);
    if (this.categoryFrm.valid) {
      const value = this.categoryFrm.value;
      let category: Category = {
        id: uuid(),
        ...value
      };
      // let category = new Category();
      // category.id = Math.random();
      // category.categoryName = this.categoryFrm.get('categoryName').value;
      // category.userCategory["id"] = this.categoryFrm.get('userIdCreated').value;
      // category.dateCreated = this.categoryFrm.get('dateCreated').value;
      // category.status = this.categoryFrm.get('status').value;

      this.service.createCategory(category)
        .subscribe(() => {
          this.reloadData();
          this.categoryFrm.reset();
          console.log(category);
        });
    }
  }

  deleteCategory(category: Category) {
    this.service.deleteCategory(category.id).pipe(
      mergeMap(() => this.service.getCategoryList()))
      .subscribe(categorys => {
        this.categorys = categorys;
        console.log(this.categorys);
      });

  }

  getCategoryForCreateAndDelete(category: Category) {
    this.category1 = category;
  }

  categoryTrackByFn(category: Category) {
    return category.id;
  }

  getCategoryForUpdateAndView(category: Category) {
    this.category1 = category;
   // this.categoryFrm2.patchValue(this.category1);
   this.categoryFrm2.get('categoryName').setValue(category.categoryName);
   this.categoryFrm2.get('userIdCreated').setValue(category.userCategory["id"]);
   this.categoryFrm2.get('dateCreated').setValue(category.dateCreated);
   this.categoryFrm2.get('status').setValue(category.status);
   console.log(this.category1);
  }

  // update category
  updateCategory() {
    if (this.categoryFrm2.valid) {
      const category2 = this.categoryFrm2.value;
      this.service.updateCategory(this.category1.id, category2)
        .subscribe(() => {
          this.reloadData();
          this.categoryFrm2.reset();
        })
    }
  }
}
