import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Poll } from 'src/lib/data-access/models/Poll';
import { BackendService } from 'src/lib/data-access/service/backend.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit{
  poll:Poll;
  surveyForm: FormGroup;
  params: any;
  submited:boolean = false;
  loaded:boolean = false;

  errorMessage:string = undefined;

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(private backendService: BackendService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop:string) => searchParams.get(prop) });

      if(this.params.token == undefined || this.params.pollID == undefined) {
        this.errorMessage = "Invalid URL";
        this.loaded=true;
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
   //this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    this.surveyForm = new FormGroup({});
  }

  submitSurvey():void {
    this.backendService.submitSurvey(this.poll, this.params.token, this.params.pollID).subscribe({
      next: (response) => console.log(response),
      error: (error) => this.createErrorMessage(error),
      complete: () => this.submited = true
    });
  }

  createErrorMessage(error:any):void {
    this.errorMessage = error.statusText  + " (" + error.status + ")";
  }

  openDialog():void {
    this.dialog.open(this.callAPIDialog);
  }

  //Debug Methods

  loadTestQuestions():void {
    this.poll= {name:"Testumfrage", lifetime:"1650250688", questions:[]};
    this.poll.questions.push({title:"FrageText1", id:1, type:"yesNoAnswer"});
    this.poll.questions.push({title:"FrageText2", id:2, type:"fixedAnswer", fixedAnswers:["AntwortText1", "AntwortText2","AntwortText3"]});
    this.poll.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:"", description:"Testbeschreibung für Testfrage 3"});
  }


  debug() {
    console.log(JSON.stringify(this.poll))
    console.log(this.params.token)
    //this.submitSurvey()
    this.errorMessage=undefined;
    this.loaded=true;
  }

}
