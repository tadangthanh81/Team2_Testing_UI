import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Question } from 'src/entity/Question';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionFrm: FormGroup;
  listAnswerCorrectFrm: FormArray;
  listAnswerWrongFrm: FormArray;

  get answerWrongFormGroup(){
    return this.questionFrm.get('answer_wrongs') as FormArray;
  }

  get answerCorrectFormGroup(){
    return this.questionFrm.get('answer_corrects') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit() {
    this.questionFrm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
      suggestion: ['', [Validators.required, Validators.minLength(2)]],
      answer_wrongs: this.fb.array([this.createAnswerWrong()]),
      answer_corrects: this.fb.array([this.createAnswerCorrect()])
    })
    this.listAnswerWrongFrm = this.questionFrm.get('answer_wrongs') as FormArray;
    this.listAnswerCorrectFrm = this.questionFrm.get('answer_corrects') as FormArray;
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

  // onSubmit(){
  //   if (this.questionFrm.value) {
  //     const value = this.questionFrm.value;
  //     const question: Question = {
  //       id: uuid(),
  //       ...value
  //     }
  //     this.http.post('http://localhost:3000/questions', question).subscribe(() => {
  //       this.router.navigateByUrl('/question');
  //     });
  // }
  // }

}
