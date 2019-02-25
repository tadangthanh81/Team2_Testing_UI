import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Question } from 'src/entity/Question';
import { Level } from 'src/entity/Level';
import { Category } from 'src/entity/Category';
import { Tag } from 'src/entity/Tag';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';


export function compareName(nametag = []) {
  return (c: AbstractControl) => {
    return nametag.includes(c.value.toLocaleUpperCase().trim())
      ? {
        invalidnametag: true
      }
      : null;
  };
}

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
  tag: Tag = new Tag();
  tag1: Tag;
  nametag: string[] = [];
  des: string[] = [];
  sta: string[] = [];
  //  tag mesage sucess
  @Output()
  event: EventEmitter<boolean> = new EventEmitter<boolean>();
  message: boolean;

  tagFrm: FormGroup;
  searchText: string;
  // contentQuestion =  new FormControl('');

  constructor(
    private notifierService: NotifierService,
    private service: ServiceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.service.getAllTag().subscribe(res => {
      for (let i = 0; i < res.length; i++) {
        this.nametag[i] = res[i].tagName.toLocaleUpperCase();
      }
    });
    //  tag class and validate
    this.tagFrm = this.fb.group({
      tagName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(225), compareName(this.nametag)]],
      tagDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(225)]],
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
    this.tag = new Tag();
  }
  save() {
    if (this.tagFrm.value.status === true) {
      this.tagFrm.value.status = 1;
    } else {
      this.tagFrm.value.status = 0;
    }
    const value = this.tagFrm.value;
    const newTags: Tag = {
      id: 1000000,
      ...value
    }
    this.service.createTag(newTags)
      .subscribe(() => {

      });
    this.onReset();
    this.newTag();


  }
  onReset(): void { this.resetForm(); }
  resetForm(value: any = undefined): void {
    this.tagFrm.reset(value);
  }
  onSubmit() {
    this.event.emit(true);
    this.notifierService.notify('success', 'Add new tag successfully');
    this.save();
    this.onReset();
  }


}
