import { Component, OnInit } from '@angular/core';
import { Question } from 'src/entity/Question';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/service.service';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  questionDetail: Question;
  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ServiceService) { }

  ngOnInit() {

    this.activatedRoute.paramMap.pipe(
      mergeMap(
        params => {
          const id = params.get('id');
          return this.service.getQuestion(id);
        }
      )
    ).subscribe(question => {
      this.questionDetail = question,
      console.log(this.questionDetail);

    }
    );
  }

}

