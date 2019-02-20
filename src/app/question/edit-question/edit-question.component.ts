import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Question } from 'src/entity/Question';
import { ServiceService } from 'src/app/service.service';
import { Level } from 'src/entity/Level';
import { Tag } from 'src/entity/Tag';
import { TypeQuestion } from 'src/entity/TypeQuestion';
import { Category } from 'src/entity/Category';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  question:  Question;
  editquestionFrm: FormGroup;
  data: Question;
  stus: string;
  listCategory: Category[];
  listLvl: Level[];
  listTag: Tag[];
  listType: TypeQuestion[];
  listAnswerCorrectFrm: FormArray;
  listAnswerWrongFrm: FormArray;
  

  constructor( private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ServiceService
    ) { }

  ngOnInit() {
    this.editquestionFrm = this.fb.group({
      id : [''],
      questionCategory :[''],
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
          return  this.http.get<Question>(`http://localhost:8080/question/${id}`);
        }
      )
    ).subscribe(question => {
      this.editquestionFrm.patchValue(question); 
      this.data = question;
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

  getData1(){
    this.data.questionCategory.id
   
  }
  onSubmit(){
      console.log(this.data.questionCategory.id)
    
    
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
