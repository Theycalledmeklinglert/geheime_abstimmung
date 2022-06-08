import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { Poll } from 'src/lib/data-access/models/Poll';
import { BackendService } from 'src/lib/data-access/service/backend.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, AfterViewInit{
  vote:Poll;
  surveyForm: FormGroup;
  params: any;
  submited:boolean = false;
  loaded:boolean = false;

  errorMessage:string = undefined;

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;


  constructor(private backendService: BackendService, public dialog: MatDialog) {}

  ngOnInit(): void {

    this.vote= {name:"Offline", lifetime:"1650250688", questions:[]}; //only for init

    this.params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop:string) => searchParams.get(prop) });


      if(this.params.token == undefined || this.params.pollID == undefined) {
        this.errorMessage = "Invalid URL";
        this.loaded=true;
      }


    this.backendService.loadPollByID(this.params.token, this.params.pollID)
      .pipe(catchError(val => of(`I caught: ${val}`)))
      .subscribe((poll:Poll) =>{
        this.vote = poll;
        this.loaded = true;
      }
    );

   this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    this.surveyForm = new FormGroup({});
    this.surveyForm.addControl("init", new FormControl(null,Validators.required)); //setzt temporäre Control um Fehler NG0100 zu vermeiden
  }

  ngAfterViewInit(): void {
    this.surveyForm.removeControl("init"); //löscht nachdem die ChildComponents intitialisiert wurden,
  }

  submitSurvey():void {
    this.submited = true;
    this.backendService.submitSurvey(this.vote, this.params.token, this.params.pollID).subscribe();
  }

  openDialog():void {
      const dialogRef = this.dialog.open(this.callAPIDialog);

      dialogRef.afterClosed()
     // .subscribe(result => {console.log(`Dialog result: ${result}`); }); //debug

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
