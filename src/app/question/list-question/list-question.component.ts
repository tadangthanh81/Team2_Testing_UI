import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  //tag mesage sucess
  success = false;

  //message udpate multi
  message: string;

  //selection
  levelSelected: string = "1";
  categorySelected: string = "2";
  tagSelected: string = "1";

  tagFrm: FormGroup;
  searchText: string;

  displayedColumns: string[] = ['select', 'category', 'create_by', 'date', 'level', 'content', 'tag', 'action'];
  dataSource = new MatTableDataSource<Question>(this.listQuestion);
  selection = new SelectionModel<Question>(true, []);

  tabAllQuestion: TabInfo;
  searchStr = '';
  isSearching = false;
  isCheckAll = false;
  maxPage: number;
  @Input()
  numberOfQuestion: number;
  @Input()
  entities: number;

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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
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

    this.tabAllQuestion = { currentPage: 0, entities: 0, sizeOfPage: 5 };

    this.loadListQuestion();

    this.service.getType().subscribe(
      type => this.listType = type
    );
    this.service.getAllLvl().subscribe(
      lvl => this.listLvl = lvl
    );
    this.service.getAllCategory().subscribe(
      category => this.listCategory = category
    );
    this.service.getAllTag().subscribe(
      tag => this.listTag = tag
    );
  }
  loadListQuestion() {
    if (this.isSearching) {
      this.service.searchQuestionByContent(this.searchStr, this.tabAllQuestion.currentPage + '', this.tabAllQuestion.sizeOfPage + '').subscribe(
        lquestionbyContent => {
          this.listQuestion = lquestionbyContent;
          this.dataSource.data = this.listQuestion;
        }
      );
      this.selection = new SelectionModel<Question>(true, []);
      this.service.countSearchQuestion(this.searchStr).subscribe(
        count => {
          this.tabAllQuestion.entities = +count.headers.get('CountSearchQuestion'),
          this.maxPage = Math.trunc(+count.headers.get('CountSearchQuestion') / this.tabAllQuestion.sizeOfPage),
          console.log("a", this.maxPage)
        }
      );
    } else {
      this.service.getQuestions(
        this.tabAllQuestion.currentPage + '',
        this.tabAllQuestion.sizeOfPage + ''
      ).subscribe(
        lquestion => {
          this.listQuestion = lquestion;
          this.dataSource.data = this.listQuestion
        }
      );
      this.selection = new SelectionModel<Question>(true, []);
      this.service.getQuestionSum().subscribe(
        sum => {this.tabAllQuestion.entities = +sum.headers.get('SumQuestion'),
        this.maxPage = Math.trunc(+sum.headers.get('SumQuestion') / this.tabAllQuestion.sizeOfPage),
          console.log("b", this.maxPage)}
      );
    }
  }
  /** function search by content question*/
  searchByContent() {
    this.tabAllQuestion.currentPage = 0;
    if (this.searchStr !== '') {
      this.isSearching = true;
    } else {
      this.isSearching = false;
    }
    this.loadListQuestion();
  }

  loadPopupUpdate() {
    this.message = "";
  }

  updateMuiltiQestion() {
    if (this.selection.selected.length == 0) {
      this.message = "No records have been selected yet!";
    } else {
      this.selection.selected.forEach(element => {
        element.questionLevel.id = this.levelSelected;
        element.questionCategory.id = +this.categorySelected;
        element.questionTag.id = this.tagSelected;
        this.service.updateMutilQuestion1(element).subscribe(success => {
          update => this.quesiton.push(update)
        }, error => {
          console.log(error);
        });
      });
      location.reload();
    }
  }

  choisePage(e) {
    this.tabAllQuestion.sizeOfPage = e.value;
    this.tabAllQuestion.currentPage = 0;
    this.loadListQuestion();
  }

  previousPage() {
    if (this.tabAllQuestion.currentPage !== 0) {
      this.tabAllQuestion.currentPage--;
    } else {
      this.tabAllQuestion.currentPage = 0;
    }
    this.loadListQuestion();
    this.isCheckAll = false;
  }
  nextPage() {
    if (this.tabAllQuestion.currentPage === this.maxPage) {
      this.tabAllQuestion.currentPage = this.maxPage;
    } else if(this.maxPage === 1){
      this.tabAllQuestion.currentPage = this.maxPage - 1;
    } else {
      this.tabAllQuestion.currentPage++;
    }
    this.loadListQuestion();
    this.isCheckAll = false;
  }
  setPage(page: number) {
    if(this.tabAllQuestion.currentPage === 1){
      this.tabAllQuestion.currentPage = page - 1;
    }else if(this.maxPage === 1){
      this.tabAllQuestion.currentPage = this.maxPage - 1;
    } else{
      this.tabAllQuestion.currentPage = page;
    }
    console.log(this.tabAllQuestion.currentPage);

    this.loadListQuestion();
  }
  keyPressSearch(e) {
    if (e.charCode === 13) {
      this.searchByContent();
    }
  }
}
export interface TabInfo {
  currentPage: number;
  entities: number;
  sizeOfPage: number;
}
