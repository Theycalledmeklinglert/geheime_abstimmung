import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from 'src/lib/data-access/models/question';
import { Vote } from 'src/lib/data-access/models/vote';
import { BackendService } from 'src/lib/data-access/service/backend.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  vote:Vote;
  surveyFrom: FormGroup;
  debugObserbale: any;

  constructor(private backendService: BackendService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    this.surveyFrom = this.fb.group({

    })

    /*

    Schmerz

    for(var question of this.vote.questions){
      if(question.type === "yesNoAnswer"){
        this.surveyFrom.addControl(question.title, null, [
          Validators.required,
          Validators.email,
          Validators.minLength(6)
        ])
      }


    }

    var loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ])
    })
    */

  }

  consoleLogging():void {

    this.vote.questions.forEach(question => console.log(question.title));
  }

  submitSurvey():void{

  }

  loadTestQuestions():void {
    this.vote= {name:"Testumfrage", lifetime:"1650250688", questions:[]};
    this.vote.questions.push({title:"FrageText1", id:1, type:"yesNoAnswer"});
    this.vote.questions.push({title:"FrageText2", id:2, type:"fixedAnswer", fixedAnswers:["AntwortText1", "AntwortText2","AntwortText3"]});
    this.vote.questions.push({title:"FrageText3", id:3, type:"individualAnswer", individualAnswer:""});
  }


  //temp!!!!!!!!!!!!!
  debug() {
    
  }

}
