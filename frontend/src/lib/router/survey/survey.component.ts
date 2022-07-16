import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Poll } from 'src/lib/data-access/models/Poll';
import { BackendService } from 'src/lib/data-access/service/backend.service';
import {EncryptionService} from "../../data-access/service/encryption.service";
import {EncryptedData} from "../../data-access/models/encryptedData";
import {Answer} from "../../data-access/models/answer";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit{
  poll:Poll;
  pollForm: FormGroup;
  params: any;
  submited:boolean = false;
  loaded:boolean = false;

  errorMessage:string = undefined;

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(private backendService: BackendService, public dialog: MatDialog, private cryptService: EncryptionService) {}

  ngOnInit(): void {
    this.params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop:string) => searchParams.get(prop) });

      if(this.params.token == undefined || this.params.pollID == undefined) {
        this.errorMessage = "Invalid URL";
        this.loaded = true;
      }
      else {
        this.backendService.loadPollByID(this.params.token, this.params.pollID)
          .subscribe({
            next: (response: Poll) => {
              this.poll = response;
              this.loaded = true;
            },
            error: (error) => {
              switch (error.status) {
                default: this.createErrorMessage(error); break;
                case 404: this.errorMessage = "Poll Not Found (404)"; break;
                case 403: this.errorMessage = "Invalid Token (403)"; break;
              }
              this.loaded = true;
            },
          });
      }
    this.pollForm = new FormGroup({});
  }

  submitSurvey():void {
    let answers: Answer[] = this.collectAnswers();
    let encrypted: EncryptedData = this.cryptService.encrypt(this.poll.publicKey, answers);

    this.backendService.submitSurvey(encrypted, this.params.token, this.params.pollID).subscribe({
      next: (response) => this.submited = true,
      error: (error) => this.createErrorMessage(error)
    });
  }

  createErrorMessage(error:any):void {
    this.errorMessage = error.statusText  + " (" + error.status + ")";
  }

  openDialog():void {
    this.dialog.open(this.callAPIDialog);
  }

  collectAnswers(){
    let result: Answer[] = [];

    this.poll.questions.forEach(q => {
      if(q.type == 'yesNoAnswer'){
        result.push( {id: q.id, answer: q.yesNo});
      }
      else if(q.type == 'fixedAnswer'){
         result.push({id: q.id, answer: q.multipleChoiceAnswer});
      }
      else result.push( {id: q.id, answer: q.individualAnswer});
    })
    return result;
  }
}
