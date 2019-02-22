import { Component, OnInit } from '@angular/core';
import { UploadserviceService } from './service/upload/uploadservice.service';
import { NotifierService } from 'angular-notifier';
import { error } from 'util';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iplist-question',
  templateUrl: './iplist-question.component.html',
  styleUrls: ['./iplist-question.component.css']
})
export class IplistQuestionComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: File;
  currentFileInport: File;
  mess: string;
  check: boolean;


  constructor(private fb: FormBuilder, private uploadService: UploadserviceService, private router: Router,
    private http: HttpClient, private notifierService: NotifierService) {
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  ngOnInit() {
  }

  //to upload

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload1() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.notifierService.notify('error', 'Upload failed!')
        console.log('upload is failed!')
        console.log("sfsff: " + event.type)
      }

      this.notifierService.notify('success', 'File is completely uploaded!');
      console.log('File is completely uploaded!')

      this.uploadService.importToServer(this.currentFileUpload)
        .subscribe(

          success => {
          },
          error => {
            console.log("error: " + error.error.text);
            if (error.error.text === 'Ok') {

              this.notifierService.notify('success', 'Import exam successfully');
              // setTimeout(() => { this.router.navigateByUrl('/exam'); }, 2000);
            } else if (error.error.text === 'not Ok') {
              this.notifierService.notify('error', 'Import exam Failed');
            }
          }
        );
    });

  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      success => {
      },
      error => {
        console.log("error: " + error.error.text);
        if (error.error.text === 'Not matching extension file') {
          this.notifierService.notify('error', 'Not matching extension file');
        } else if (error.error.text === 'OK') {
          this.notifierService.notify('success', 'successfully uploaded ' + this.currentFileUpload.name + '!');
          this.uploadService.importToServer(this.currentFileUpload)
            .subscribe(
              success => {
              },
              error => {
                console.log("error: " + error.error.text);
                if (error.error.text === 'Ok') {
                  this.notifierService.notify('success', 'Import exam successfully');
                  //this.loadExamsPage();
                  //window.location.reload();
                  //this.router.navigate(['']);
                } else if (error.error.text === 'Not ok') {
                  this.notifierService.notify('error', 'Import exam Failed');
                }
              }
            );
        } else if (error.error.text === ("ERROR! can't upload " + this.selectFile + "!")) {
          this.notifierService.notify('error', '"ERROR! cant upload "' + this.selectFile + "!");
        }
      }
    )
    //end
  }

}
