import { Component, OnInit } from '@angular/core';
import { TypeQuestion } from 'src/entity/TypeQuestion';
import { Tag } from 'src/entity/Tag';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { mergeMap } from 'rxjs/operators';
import { Question } from 'src/entity/Question';
import { Answer } from 'src/entity/Answer';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  editQuestionFrm: FormGroup;
  // listAnswerFrm: FormGroup;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: TypeQuestion[];
  questionEdit: Question;
  listans: Answer[];
  as: Answer;
  // stta : Answer[];
  categorySelected: string;
  arayQ: Question[];
  listAnswerFrm: FormArray;
  public Editor = ClassicEditor;

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRounte: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
   
    this.editQuestionFrm = this.fb.group({
      questionCategory:  this.fb.group({
        id: [''],
        categoryName: [''],
        userCategory: [''],
        dateCreated: [Date],
        status: ['']
      }),
      questionLevel:  this.fb.group({
        id: [''],
        levelName:  [''],
        status:  ['']
      }),
      questionType: this.fb.group({
        id: '',
        typeName:  [''],
        status:  ['']
      }),
      questionTag:  this.fb.group({
        id: '',
        tagName: [''],
        tagDescription: [''],
        status:  ['']
      }),
      content: ['', [Validators.required, Validators.minLength(2)]],
      sugguestion: ['', [Validators.required, Validators.minLength(2)]],
      questionAnswer: this.fb.array([this.createAnswer()]),
      // this.fb.group({
      //   id: '',
      //   content:[''],
      //   isTrue:[''],
      //   status:['']
      // }),
      // this.fb.array([this.createAnswer()]),
      status: [''],
      dateCreated: "2019-02-15",
      userQuestion: 1
    });

    this.activatedRounte.paramMap.pipe(
      mergeMap(
        params => {
          const id = params.get('id');
          return this.http.get<Question>(`http://localhost:8080/question/${id}`);
        }
      )
    ).subscribe(question => {
     
      this.editQuestionFrm.patchValue(question)
      this.questionEdit = question

    }
    );

    

    this.service.getAllCategory().subscribe(
      lCategory => {
        this.listCategory = lCategory
      }
    );
    this.service.getAllLvl().subscribe(
      lLvl => {
        this.listLvl = lLvl
      }
    );
    this.service.getAllAnswer().subscribe(
      lAns => {
        this.listans = lAns
      }
    );
    this.service.getAllTag().subscribe(
      lTag => {
        this.listTag = lTag
      }
    );

    this.service.getType().subscribe(
      lType => {
        this.listType = lType
      }
    );

  }
  createAnswer(): FormGroup {
    return this.fb.group({
      id : [''],
      content:[''],
      isTrue:[''],
      status:['']
    });
  }
   getAnswerFormGroup(index): FormGroup {
    const formGroup = this.listAnswerFrm.controls[index] as FormGroup;
    return formGroup;
  }
  onSubmit() {
    // if (this.editQuestionFrm.value.status == true) {
    //   this.questionEdit.status == 1;
    // } else {
    //   this.questionEdit.status == 0;
    // }

    // if (this.editQuestionFrm.value.isTrue == true) {
    //   this.as.isTrue == 1;
    // } else {
    //   this.as.isTrue == 0;
    // }

    // if (this.questionEdit.questionAnswer[0].status == 1) {
    //   this.questionEdit.questionAnswer[0].status == true
    // } else {
    //   this.editQuestionFrm.value.as.statusOfAnswer == 0;
    // }
    // if (this.listAnswerFrm.length) {
    //   for (var i = 0; i < this.listAnswerFrm.length; i++) {
    //     if (this.getAnswerFormGroup(i).value.isTrue === true) {
    //       this.getAnswerFormGroup(i).value.isTrue = 1
    //     }
    //   }
    // }
    if (this.editQuestionFrm.value) {
      const value = this.editQuestionFrm.value;
      const question: Question =
      {
        id: this.questionEdit.id,
        ...value
      };
    

      this.service.updateMutilQuestion1(question ).subscribe(() => {
        console.log(question);
      });
    }
  }
}
