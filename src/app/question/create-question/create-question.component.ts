import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Question } from 'src/entity/Question';
import { v4 as uuid } from 'uuid';
import { ServiceService } from 'src/app/service.service';
import { Category } from 'src/entity/Category';
import { Level } from 'src/entity/Level';
import { Tag } from 'src/entity/Tag';
import { TypeQuestion } from 'src/entity/TypeQuestion';
import { Answer } from 'src/entity/Answer';
import { User } from 'src/entity/User';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionFrm: FormGroup;
  listAnswerFrm: FormArray;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: TypeQuestion[];
  user: User;
  date: Date;
  public Editor = ClassicEditor;

  get answerFormGroup() {
    return this.questionFrm.get('questionAnswer') as FormArray;
  }

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {

    this.user = {
      userId: "1",
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      status: 0
    }

    this.date = new Date();

    this.questionFrm = this.fb.group({
      questionCategory: [''],
      questionLevel: [''],
      questionType: [''],
      questionTag: [''],
      content: ['', [Validators.required, Validators.minLength(2)]],
      sugguestion: [''],
      userQuestion: this.user,
      dateCreated : this.date,
      questionAnswer: this.fb.array([this.createAnswer()])
    })
    this.listAnswerFrm = this.questionFrm.get('questionAnswer') as FormArray;

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

    this.service.getAllTag().subscribe(
      lTag => {
        this.listTag = lTag
      }
    );

    this.service.getAllType().subscribe(
      lType => {
        this.listType = lType
      }
    );
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      id: uuid(),
      content: ['', Validators.compose([Validators.required])],
      isTrue: [0]
    });
  }

  addAnswer() {
    this.listAnswerFrm.push(this.createAnswer());
  }


  removeAnswer(index) {
    this.listAnswerFrm.removeAt(index);
  }

  getAnswerFormGroup(index): FormGroup {
    const formGroup = this.listAnswerFrm.controls[index] as FormGroup;
    return formGroup;
  }

  onSubmit() {

    if (this.listAnswerFrm.length) {
      for (var i = 0; i < this.listAnswerFrm.length; i++) {
        if (this.getAnswerFormGroup(i).value.isTrue === true) {
          this.getAnswerFormGroup(i).value.isTrue = 1
        }
      }
    }

    if (this.questionFrm.value) {
      const value = this.questionFrm.value;
      const question: Question =
      {
        id: uuid(),
        ...value
      };
      this.service.createQuestion(question).subscribe(() => {
        //alert("Insert success");
        //this.router.navigateByUrl('/question');
        console.log(JSON.stringify(question));
      });
    }
  }

}
