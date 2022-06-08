import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Poll } from 'src/lib/data-access/models/Poll';
import { BackendService } from 'src/lib/data-access/service/backend.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit{
  vote:Poll;
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

    this.backendService.loadPollByID(this.params.token, this.params.pollID)
      .subscribe({
        next: (response:Poll) => {
          this.vote = response;
          this.loaded = true;
        },
        error: (error) => {
          switch(error.status) {
            default: this.errorMessage = "Special Error: " + error.status; break;
            case 500: this.errorMessage = "Internal Server Error (500)";break;
            case 504: this.errorMessage = "Gateway Timout (504)"; break;
            case 404: this.errorMessage = "Poll Not Found (404)"; break;
            case 403: this.errorMessage = "Invalid Token (403)"; break;
          }
          this.loaded = true;
        }
      });

   //this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    this.surveyForm = new FormGroup({});
    this.surveyForm.addControl("init", new FormControl(null,Validators.required)); //setzt temporäre Control um Fehler NG0100 zu vermeiden
  }

  submitSurvey():void {
    this.submited = true;
    this.backendService.submitSurvey(this.vote, this.params.token, this.params.pollID).subscribe();
  }

  openDialog():void {
    this.dialog.open(this.callAPIDialog);
  }

  //Debug Methods

  loadTestQuestions():void {
    this.vote= {name:"Testumfrage", lifetime:"1650250688", questions:[]};
    this.vote.questions.push({title:"FrageText1", id:1, type:"yesNoAnswer"});
    this.vote.questions.push({title:"FrageText2", id:2, type:"fixedAnswer", fixedAnswers:["AntwortText1", "AntwortText2","AntwortText3"]});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:"", description:"Testbeschreibung für Testfrage 3"});
  }


  debug() {
    console.log(JSON.stringify(this.vote))
    console.log(this.params.token)
    //this.submitSurvey()
    this.errorMessage=undefined;
    this.loaded=true;
  }

}
