import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Question } from 'src/entity/Question';
@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  question:  Question;
  questionFrm: FormGroup;
  constructor( private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
   
    this.activatedRoute.paramMap.pipe(
      mergeMap(
        params => {
          const id = params.get('id');
          return this.http.get<Question>(`http://localhost:3000/question/${id}`);
        }
      )
    ).subscribe(question => {
      this.question = question;
      this.questionFrm.patchValue(question);
    });
  }
  onSubmit(){
    if (this.questionFrm.valid) {
      const question = this.questionFrm.value;
      this.http.patch(`http://localhost:3000/question/${this.question.id}`, question)
        .subscribe(() => {
          this.router.navigateByUrl('/question');
        });
    }
  }
}
