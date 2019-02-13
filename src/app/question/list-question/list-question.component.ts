import { Component, OnInit, Output } from '@angular/core';
import { Tag } from 'src/entity/Tag';
import {v4 as uuid} from 'uuid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import {ServiceService} from 'src/app/service.service';



@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {
   tagFrm: FormGroup;

  constructor(private fb :FormBuilder,
              private http:HttpClient,
              private router: Router ) { 
              }
 ngOnInit() {
  //  tag class and validate
   this.tagFrm=this.fb.group({
     tag_name:['',[Validators.required, Validators.minLength(3),Validators.maxLength(225)]],
     description:['',[Validators.required, Validators.minLength(10), Validators.maxLength(225)]],
     status:['',[Validators.required]]
   });
 }
//  tag mesage sucess
message=false;
 onSubmit(){
  //  tag add + auto generate id
   if(this.tagFrm.value){
    const value=this.tagFrm.value;
     const tag:Tag = {
       id:uuid(),
       ...value
    };
    this.http.post('http://localhost:3000/tag',tag).subscribe(()=>{this.router.navigateByUrl('/tag');});
    this.message = true;
    }
}
}
