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
import { Type } from 'src/entity/Type';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionFrm: FormGroup;
  listAnswerCorrectFrm: FormArray;
  listAnswerWrongFrm: FormArray;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: Type[];
  
  categorySelected: string = "2";

  get answerWrongFormGroup(){
    return this.questionFrm.get('answer_wrongs') as FormArray;
  }

  get answerCorrectFormGroup(){
    return this.questionFrm.get('answer_corrects') as FormArray;
  }

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit() {
    this.questionFrm = this.fb.group({
      category:[],
      level:[''],
      type:[''],
      tag:[''],
      content: ['', [Validators.required, Validators.minLength(2)]],
      suggestion: ['', [Validators.required, Validators.minLength(2)]],
      answer_wrongs: this.fb.array([this.createAnswerWrong()]),
      answer_corrects: this.fb.array([this.createAnswerCorrect()])
    })
    this.listAnswerWrongFrm = this.questionFrm.get('answer_wrongs') as FormArray;
    this.listAnswerCorrectFrm = this.questionFrm.get('answer_corrects') as FormArray;

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

  createAnswerWrong(): FormGroup{
    return this.fb.group({
      answer_wrong:[null, Validators.compose([Validators.required])]
    });
  }

  createAnswerCorrect(): FormGroup{
    return this.fb.group({
      answer_correct:[null, Validators.compose([Validators.required])]
    });
  }

  addAnswerCorrect(){
    this.listAnswerCorrectFrm.push(this.createAnswerCorrect());
  }

  addAnswerWrong(){
    this.listAnswerWrongFrm.push(this.createAnswerWrong());
  }

  removeAnswerCorrect(index){
    this.listAnswerCorrectFrm.removeAt(index);
  }

  removeAnswerWrong(index){
    this.listAnswerWrongFrm.removeAt(index);
  }

  getAnswerCorrectFormGroup(index): FormGroup{
    const formGroup = this.listAnswerCorrectFrm.controls[index] as FormGroup;
    return formGroup;
  }

  getAnswerWrongFormGroup(index): FormGroup{
    const formGroup = this.listAnswerWrongFrm.controls[index] as FormGroup;
    return formGroup;
  }

  onSubmit(){
    if (this.questionFrm.value) {
      const value = this.questionFrm.value;
      const question: Question = {
        id: uuid(),
        ...value
      }
      this.service.createQuestion(question).subscribe(() => {
        console.log(question)
      });
  }
  }

}