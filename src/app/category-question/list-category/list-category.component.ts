import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/entity/Category';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ServiceService } from 'src/app/service.service';
import { MatTableDataSource, MatSort } from '@angular/material';


@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  listCategory: any[];
  categorys: Category[] = [];
  categoryFrm: FormGroup;
  categoryFrm2: FormGroup;
  category1: Category;

  searchText: string;
  displayedColumns: string[] = ['CategoryName', 'UserCreated', 'DateCreated', 'status', 'action'];
  dataSource = new MatTableDataSource<Category>(this.listCategory);

  size: number = 1;

  sumCategory: string;
  sumC: number;
  currentPage: number = 0;
  pages: number = 0;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: ServiceService
  ) { }

  choisePage() {
    this.currentPage = 0;
    this.loadListCategory(this.currentPage.toString(), this.size.toString());
    this.numberOfPage();
    console.log('size', this.size);
    console.log('pages', this.pages);
  }


  ngOnInit() {

    // this.reloadData();
    this.validate();

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CategoryName': return item.categoryName;
        case 'UserCreated': return item.userCategory.fullName;
        case 'DateCreated': return item.dateCreated;
        case 'status': return item.status;
        default: return item[property];
      }
    };

    this.dataSource.sort = this.sort;

    this.loadListCategory(this.pages.toString(), this.size.toString());

    this.service.getCategorySum().subscribe(
      sum => {
        this.sumCategory = sum.headers.get('SumCategory'),
          this.sumC = Number(this.sumCategory),
          console.log('question sum', this.sumC),
          console.log('size', this.size),
          this.pages = Math.trunc((this.sumC) / (this.size)),
          console.log('pages', this.pages)
      }
    );
  }

  loadListCategory(p: string, s: string) {
    this.service.getCategorys(p, s).subscribe(
      lcategory => {
        this.listCategory = lcategory;
        this.dataSource.data = this.listCategory;
      }
    );
  }

  /** function search by content question*/
  searchByContent(contentCategory) {
    this.service.getListCategoryByContent(contentCategory).subscribe(
      lcategorybyContent => {
        this.listCategory = lcategorybyContent;
        this.dataSource.data = this.listCategory;
      }
    );
  }

  setPage(page: number) {
    this.numberOfPage();
    this.currentPage = page;

    console.log("currentpage", this.currentPage);
    console.log('size', this.size);
    console.log('pages', this.pages);
    this.loadListCategory(page.toString(), this.size.toString());
  }


  numberOfPage(): number {
    this.pages = Math.ceil((this.sumC) / (this.size));
    return this.pages;
  }

  reloadData() {
    this.service.getCategoryList()
      .subscribe(categorys => {
        this.categorys = categorys;
        console.log(this.categorys);
      })
  }

  validate() {
    this.categoryFrm = new FormGroup({
      categoryName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2)]),
      userIdCreated: new FormControl({ value: '', disabled: false }),
      dateCreated: new FormControl(new Date(),[] ),
    });

    this.categoryFrm2 = new FormGroup({
      categoryName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2)]),
      userIdCreated: new FormControl({ value: '', disabled: false }),
      dateCreated: new FormControl(new Date(),[]),
    });
  }

  onCreate() {
    if (this.categoryFrm.valid) {
      let test = this.categoryFrm.get('categoryName').value;
      console.log(test);
      this.category1.categoryName = test;
      this.category1.id = Math.random();
      console.log(this.category1);

      this.service.createCategory(this.category1)
        .subscribe(() => {
          // this.reloadData();
          this.loadListCategory(this.pages.toString(), this.size.toString());
          this.categoryFrm.reset();
        });
    }
  }

  deleteCategory(category: Category) {
    this.service.deleteCategory(category.id).pipe(
      mergeMap(() => this.service.getCategoryList()))
      .subscribe(categorys => {
        this.categorys = categorys;
        this.loadListCategory(this.pages.toString(), this.size.toString());
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
    this.categoryFrm2.get('userIdCreated').setValue(category.userCategory["fullName"]);
    this.categoryFrm2.get('dateCreated').setValue(category.dateCreated);
  }

  // update category
  updateCategory() {
    let test = this.categoryFrm2.get('categoryName').value;
    console.log(test);
    this.category1.categoryName = test;
    // this.category1.id = Math.random();
    console.log(this.category1);

    this.service.createCategory(this.category1)
      .subscribe(() => {
        this.reloadData();
        this.categoryFrm2.reset();
      });
  }
}
