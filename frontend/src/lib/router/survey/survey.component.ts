import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vote } from 'src/lib/data-access/models/vote';
import { BackendService } from 'src/lib/data-access/service/backend.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, AfterViewInit{
  vote:Vote;
  surveyForm: FormGroup;


  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    this.surveyForm = new FormGroup({});
    this.surveyForm.addControl("init", new FormControl(null,Validators.required)); //setzt temporäre Control um Fehler NG0100 zu vermeiden
  }

  ngAfterViewInit(): void {
    this.surveyForm.removeControl("init"); //löscht nachdem die ChildComponents intitialisiert wurden,
  }

  submitSurvey():void{
    console.log(this.surveyForm.value);
  }


  //Debug Methods

  loadTestQuestions():void {
    this.vote= {name:"Testumfrage", lifetime:"1650250688", questions:[]};
    this.vote.questions.push({title:"FrageText1", id:1, type:"yesNoAnswer"});
    this.vote.questions.push({title:"FrageText2", id:2, type:"fixedAnswer", fixedAnswers:["AntwortText1", "AntwortText2","AntwortText3"]});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});

  }


  debug() {

  }

}
