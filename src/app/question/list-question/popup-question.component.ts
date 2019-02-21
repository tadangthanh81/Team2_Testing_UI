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
  isChecked : boolean;
  listQuestion: Question[];
  listLvl: Level[];
  listCategory: Category[];
  listTag: Tag[];
  quesiton: Question[];
  tag: Tag = new Tag();

  //  tag mesage sucess

  message: boolean;

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
      tagDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(225)]],

      status: ['']
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

  newTag(): void {
    this.message = true;
    this.tag = new Tag();
  }
  save() {
    if( this.tagFrm.value.status === true){
      this.tagFrm.value.status = 1;
    }else{
      this.tagFrm.value.status = 0;
    }
    const value = this.tagFrm.value;
    const newTags: Tag = {
      id: 1000000,
      ...value
    }


   this.service.createTag(this.tagFrm.value)
   .subscribe( () => {
    this.tagFrm.reset();
    });
    this.tag = new Tag();
  }
  onSubmit() {
     this.message = true;
     this.save();
  }

}
