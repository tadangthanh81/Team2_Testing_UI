import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Question } from 'src/entity/Question';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { Tag } from 'src/entity/Tag';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {v4 as uuid} from 'uuid';


@Component({
  selector: 'app-popup-list-question',
  templateUrl: './popup-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class PopupListQuestionComponent implements OnInit {

  listQuestion: Question[];
  listLvl: Level[];
  listCategory: Category[];
  listTag: Tag[];
  quesiton: Question[];

  //  tag mesage sucess
  success = false;
  message: string;

  tagFrm: FormGroup;
  searchText : string;
  // contentQuestion =  new FormControl('');

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
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(225)]],
      status: ['', [Validators.required]]
    });

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

  onSubmit() {
    //  tag add + auto generate id
    if (this.tagFrm.value) {
      const value = this.tagFrm.value;
      const tag: Tag = {
        id: uuid(),
        ...value
      };
      this.http.post('http: //localhost:3000/tag', tag).subscribe(() => { this.router.navigateByUrl('/tag'); });
      this.success = true;

    }
  }

}

