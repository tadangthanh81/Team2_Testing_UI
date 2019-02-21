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
  question:  Question;
  editquestionFrm: FormGroup;

  stus: string;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: TypeQuestion[];
  listAnswerCorrectFrm: FormArray;
  listAnswerWrongFrm: FormArray;
  categoryChoice: String = "this.question.questionCategory.id";

  constructor( private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ServiceService
    ) { }

  ngOnInit() {
    this.editquestionFrm = this.fb.group({
      id : [''],
      questionCategory :[this.categoryChoice],
      questionType:[''],
      questionLevel:[''],
      questionTag:[''],
      content: ['', [Validators.required, Validators.minLength(2)]],
      answer_wrongs: this.fb.array([this.createAnswerWrong()]),
      answer_corrects: this.fb.array([this.createAnswerCorrect()]),
      sugguestion: ['', [Validators.required, Validators.minLength(2)]],
      status : [''],
      dateCreated:"2019-02-15",
      userQuestion: 1
    })
    this.listAnswerWrongFrm = this.editquestionFrm.get('answer_wrongs') as FormArray;
    this.listAnswerCorrectFrm = this.editquestionFrm.get('answer_corrects') as FormArray;
    this.activatedRoute.paramMap.pipe(
      mergeMap(
        params => {
          const id = params.get('id');
          //  this.questionEdit = this.http.get<Question>(`http://localhost:8080/question/${id}`);
          return this.http.get<Question>(`http://localhost:8080/question/${id}`);
        }
      )
    ).subscribe(question => {
      this.question = question;
      this.editquestionFrm.patchValue(question);
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

  get answerWrongFormGroup(){
    return this.editquestionFrm.get('answer_wrongs') as FormArray;
  }

  get answerCorrectFormGroup(){
    return this.editquestionFrm.get('answer_corrects') as FormArray;
  }
  onSubmit(){


    if( this.editquestionFrm.value.status === true){
      this.editquestionFrm.value.status = 1;
    }else{
      this.editquestionFrm.value.status = 0;
    }
    this.service.updateMutilQuestion1(this.editquestionFrm.value).subscribe( () => {
      this.router.navigateByUrl('/question');
    });
    console.log(Question);
    }

}
