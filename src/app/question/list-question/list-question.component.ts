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
import { TypeQuestion } from 'src/entity/TypeQuestion';


@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {


  //save data json
  listQuestion: any[];
  listLvl: Level[];
  listCategory: Category[];
  listTag: Tag[];
  listType: TypeQuestion[];
  quesiton: Question[] = [];

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

  size: number = 1;

  sumQuestion: string;
  sumQ: number;
  currentPage: number = 0;
  pages: number = 0;
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

  choisePage() {
    this.currentPage =0;
    this.loadListQuestion(this.currentPage.toString(), this.size.toString());
    this.selection = new SelectionModel<Question>(true, []);
    this.numberOfPage();
    console.log('size', this.size);
    console.log('pages', this.pages);
  }

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
      tag_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(225)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(225)]],
      status: ['', [Validators.required]]
    });
    this.loadListQuestion(this.pages.toString(), this.size.toString());

    this.service.getQuestionSum().subscribe(
      sum => {
        this.sumQuestion = sum.headers.get('SumQuestion'),
          this.sumQ = Number(this.sumQuestion),
          console.log('question sum', this.sumQ),
          console.log('size', this.size),
          this.pages = Math.trunc((this.sumQ) / (this.size)),
          console.log('pages', this.pages)
      }
    );

    this.service.getType().subscribe(
      type => this.listType = type
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

  loadListQuestion(p: string, s: string) {
    this.service.getQuestions(p, s).subscribe(
      lquestion => {
        this.listQuestion = lquestion;
        this.dataSource.data = this.listQuestion;
      }
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
    if (this.selection.selected.length == 0) {
      this.message = "No records have been selected yet!";
    } else {
      this.selection.selected.forEach(element => {
        element.questionLevel.id = this.levelSelected;
        element.questionCategory.id = Number(this.categorySelected);
        element.questionTag.id = this.tagSelected;
        // this.service.updateMutilQuestion(element).subscribe(
        //   update => this.quesiton.push(update)
        // );

        this.service.updateMutilQuestion1(element).subscribe(success => {
          console.log(success);
        }, error => {
          console.log(error);
        });
        console.log(element);
      });
      location.reload();
    }
  }
  keyword:string;

  setPage(page: number) {
    this.numberOfPage();
    this.currentPage = page;

    console.log("currentpage", this.currentPage);
    console.log('size', this.size);
    console.log('pages', this.pages);
    this.loadListQuestion(page.toString(), this.size.toString());
    this.selection = new SelectionModel<Question>(true, []);
  }
  numberOfPage():number{
    this.pages = Math.ceil((this.sumQ) / (this.size));
    return this.pages;
  }

}
