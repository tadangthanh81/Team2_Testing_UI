import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Question } from 'src/entity/Question';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { Tag } from 'src/entity/Tag';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TypeQuestion } from 'src/entity/TypeQuestion';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

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
  question: Question;

  //tag mesage sucess
  success = false;

  //message udpate multi
  message: string;

  //selection
  levelSelected = '1';
  typeSelected;
  categorySelected;
  tagSelected;

  levelF: string = "";
  typeF: string = "";
  categoryF: string = "";
  tagF: string = "";
  fullName:string ="";
  datecreated:string ="";

  dateInputFilter = new Date();
  userInputFilter: String;

  tagFrm: FormGroup;
  searchText: string;

  displayedColumns: string[] = ['select', 'category', 'create_by', 'date', 'level', 'content', 'status', 'action'];
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
        case 'category': return item.category.categoryName;
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
      lvl => {
        this.listLvl = lvl
      }
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
            this.maxPage = Math.ceil(+count.headers.get('CountSearchQuestion') / this.tabAllQuestion.sizeOfPage)
        }
      );
    } else {
      this.service.getQuestions(
        this.tabAllQuestion.currentPage + '',
        this.tabAllQuestion.sizeOfPage + ''
      ).subscribe(
        lquestion => {
          this.listQuestion = lquestion,
            this.dataSource.data = this.listQuestion
        }
      );
      this.selection = new SelectionModel<Question>(true, []);
      this.service.getQuestionSum().subscribe(
        sum => {
          this.tabAllQuestion.entities = +sum.headers.get('SumQuestion'),
            this.maxPage = Math.ceil(+sum.headers.get('SumQuestion') / this.tabAllQuestion.sizeOfPage)
        }
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


  // .set("userName", this.fullName)
  // .set("dateCreated", this.dateCreated)
  // .set("tagId", this.tagF)
  // .set("levelId", this.levelF)
  // .set("categoryId",this.categoryF)
  params = new HttpParams();
  // get list question by filter
  filterByAttribute(fullName: string, dateCreated: Date) {
    if(fullName!==''){
      this.params.set("userName", fullName);
    }else if(dateCreated.toString()!==''){
      this.params.set("dateCreated", dateCreated.toString());
    }else if(this.tagF!==''){
      this.params.set("tagId", this.tagF);
    }else if(this.levelF !==''){
      this.params.set("levelId", this.levelF)
    }else if(this.categoryF !==''){
      this.params.set("categoryId",this.categoryF)
    }else if(this.typeF !==''){
      this.params.set("typeId", this.typeF)
    }
    this.params.set("page","0");
    this.params.set("size","5");
    console.log("hi",this.params.get("hi"));

    // this.service.filterByALl(this.params).subscribe(
    //     lquestionbyFilter => {
    //       this.listQuestion = lquestionbyFilter;
    //       this.dataSource.data = this.listQuestion;
    //     }
    //   );
  }

  //update status
  updateStatus(id, status) {
    if (status === 1) {
      this.service.getQuestion(id).subscribe(
        q => {
          this.question = q,
            this.question.status = 0,
            this.service.updateQuestion(this.question).subscribe(
              pip => this.loadListQuestion()
            )
        }
      );
    } else {
      this.service.getQuestion(id).subscribe(
        q => {
          this.question = q,
            this.question.status = 1,
            this.service.updateQuestion(this.question).subscribe(
              pip => this.loadListQuestion()
            )
        }
      );
    }
  }

  loadPopupUpdate() {
    this.message = "";
  }

  updateMuiltiQestion() {
    if (this.selection.selected.length == 0) {
      this.message = "No records have been selected yet!";
    } else {
      this.selection.selected.forEach(element => {
        element.questionLevel.levelId = this.levelSelected;
        element.category.categoryId = +this.categorySelected;
        element.questionTag.tagId = this.tagSelected;
        this.service.updateMutilQuestion1(element).subscribe(success => {
          // update => this.quesiton.push(update)
          console.log(success);

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
    if (this.tabAllQuestion.currentPage === this.maxPage - 1) {
      this.tabAllQuestion.currentPage = this.maxPage - 1;
    } else {
      this.tabAllQuestion.currentPage++;
    }
    this.loadListQuestion();
    this.isCheckAll = false;
  }
  setPage(page: number) {
    this.tabAllQuestion.currentPage = page;
    console.log(this.tabAllQuestion.currentPage);

    this.loadListQuestion();
  }
  keyPressSearch(e) {
    if (e.charCode === 13) {
      this.searchByContent();
    }
  }

  submitPopUp(e) {
    console.log('test');
    this.service.getAllTag().subscribe(
      tag => {
        console.log(tag);
        this.listTag = tag;
      }
    );
  }
}
export interface TabInfo {
  currentPage: number;
  entities: number;
  sizeOfPage: number;
}
