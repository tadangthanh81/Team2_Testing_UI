import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Question } from 'src/entity/Question';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { Tag } from 'src/entity/Tag';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {v4 as uuid} from 'uuid';

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
  quesiton: Question[];

  //  tag mesage sucess
  success = false;

  message: string;
  levelSelected: string = "1";
  categorySelected: string = "null";
  tagSelected: string = "null";

  tagFrm: FormGroup;

  displayedColumns: string[] = ['select', 'id', 'name', 'action'];
  dataSource = new MatTableDataSource<Question>(this.listQuestion);
  selection = new SelectionModel<Question>(true, []);

  constructor(
    private service: ServiceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
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

  /** Whether the number of selected elements matches the total number of rows. */
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

  loadPopupUpdate() {
    this.message = "";
    this.selection.selected.forEach(element => {
      console.log(element.id)
    });
  }

  updateMuiltiQestion() {
    const a: Level = new Level();
    a.id = this.levelSelected;
    const b: Category = new Category();
    b.id = this.categorySelected;
    const c: Tag = new Tag();
    c.id = this.tagSelected;
    const newQ: Question = new Question();
    newQ.questionLevel = a;
    newQ.questionCategory = b;
    newQ.questionTag = c;
    if (this.selection.selected.length == 0) {
      this.message = "No records have been selected yet!";
    } else {
      this.selection.selected.forEach(element => {
        this.service.updateMutilQuestion(newQ, element.id).subscribe(
          update => this.quesiton.push(update)
        )
      })
    }
  }
  newTag(): void {
    this.success = true;
    this.tag = new Tag();
  }
  save() {
    const value = this.tagFrm.value;
    const newTags: Tag = {
      id: 100,
      ...value
    }
 
    this.service.createTag(newTags).subscribe(data => console.log(data), error => console.log(error));
      // .subscribe(data => console.log(data), error => console.log(error));
      // .subscribe(hero => this.heroes.push(hero));
    this.tag = new Tag();
  }
  onSubmit() {
    //  tag add + auto generate id
    // if (this.tagFrm.value) {
    //   const value = this.tagFrm.value;
    //   const tag: Tag = {
    //     id: uuid(),
    //     ...value
    //   };
    //   this.http.post('http://localhost:3000/tag', tag).subscribe(() => { this.router.navigateByUrl('/tag'); });
    //   this.success = true;
    // }
    this.success = true;
    this.save();
   
  }



}
