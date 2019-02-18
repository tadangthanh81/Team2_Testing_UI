import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Question } from 'src/entity/Question';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { Tag } from 'src/entity/Tag';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {


  tag: Tag = new Tag();
  

  listQuestion: Question[];
  listLvl: Level[];
  listCategory: Category[];
  listTag: Tag[];
  quesiton: Question[]= [];

  //  tag mesage sucess
  success = false;

  message: string;
  levelSelected: string = "1";
  categorySelected: string = "2";
  tagSelected: string = "1";

  tagFrm: FormGroup;
  searchText: string;

  displayedColumns: string[] = ['select', 'category', 'create_by', 'date', 'level', 'content', 'tag', 'action'];
  dataSource = new MatTableDataSource<Question>(this.listQuestion);
  selection = new SelectionModel<Question>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: ServiceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'category': return item.questionCategory.categoryName;
        case 'create_by': return item.userQuestion.fullName;
        case 'date': return item.dateCreated;
        case 'level': return item.questionLevel.levelName;
        case 'content': return item.content;
        case 'tag': return item.questionTag.tagName;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    //  tag class and validate
    this.tagFrm = this.fb.group({
      tagName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(225)]],
      tagDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(225)]],
      status: ['', [Validators.required]]
    });
    this.service.getListQuestion().subscribe(
      lquestion => {
        this.listQuestion = lquestion;
        this.dataSource.data = this.listQuestion;
      }
    );
    this.service.getAllLvl().subscribe(
      lvl => this.listLvl = lvl
    );
    this.service.getAllCategory().subscribe(
      category => this.listCategory = category
    )
    this.service.getAllTag().subscribe(
      tag => this.listTag = tag
    );
  }

  /** function search by content question*/
  searchByContent(contentQuestion) {
    this.service.getListQuestionByContent(contentQuestion).subscribe(
      lquestionbyContent => {
        this.listQuestion = lquestionbyContent;
        this.dataSource.data = this.listQuestion;
      }
    );
  }

  loadPopupUpdate() {
    this.message = "";
    this.selection.selected.forEach(element => {
      console.log(element.id)
    });
  }

  updateMuiltiQestion() {
    // const a: Level = new Level();
    // a.id = this.levelSelected;
    // const b: Category = new Category();
    // b.id = this.categorySelected;
    // const c: Tag = new Tag();
    // c.id = this.tagSelected;
    // const newQ: Question = new Question();
    // newQ.questionLevel = a;
    // newQ.questionCategory = b;
    // newQ.questionTag = c;
    if (this.selection.selected.length == 0) {
      this.message = "No records have been selected yet!";
    } else {
      this.selection.selected.forEach(element => {
        element.questionLevel.id = this.levelSelected;
        element.questionCategory.id = this.categorySelected;
        element.questionTag.id = this.tagSelected;
        this.service.updateMutilQuestion(element, element.id).subscribe(
          update => this.selection.selected.push(update)
        );
        console.log(element)
      });
    }
  }


 

 

}
