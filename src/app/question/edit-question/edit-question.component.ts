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

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  editQuestionFrm: FormGroup;
  listAnswerFrm: FormArray;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: TypeQuestion[];
  questionEdit: Question;

  categorySelected: string;

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRounte: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.editQuestionFrm = this.fb.group({
      questionCategory: [''],
      questionLevel: [''],
      questionType: [''],
      questionTag: [''],
      content: ['', [Validators.required, Validators.minLength(2)]],
      sugguestion: ['', [Validators.required, Validators.minLength(2)]],
      questionAnswer: this.fb.array([this.createAnswer()])
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

    this.listAnswerFrm = this.editQuestionFrm.get('questionAnswer') as FormArray;

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

  get answerFormGroup() {
    return this.editQuestionFrm.get('questionAnswer') as FormArray;
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      answerId: uuid(),
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

  // reloadData() {
  //   for (let i; i < this.questionEdit.questionAnswer.length; i++) {
  //     this.createAnswer();
  //   }
  // }

  onSubmit() {

    console.log(this.questionEdit.questionAnswer)
    console.log(this.questionEdit)
    console.log(this.editQuestionFrm)

    if (this.listAnswerFrm.length) {
      for (var i = 0; i < this.listAnswerFrm.length; i++) {
        if (this.getAnswerFormGroup(i).value.isTrue === true) {
          this.getAnswerFormGroup(i).value.isTrue = 1
        }
      }
    }

    if (this.editQuestionFrm.value) {
      const value = this.editQuestionFrm.value;
      const question: Question =
      {
        id: this.questionEdit.questionId,
        ...value
      };
      this.service.createQuestion(question).subscribe(() => {
        console.log(question)
      });
    }
  }
}
