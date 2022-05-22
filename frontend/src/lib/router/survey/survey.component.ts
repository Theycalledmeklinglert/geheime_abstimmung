import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert

    //this.surveyFrom = new FormBuilder().
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
    const testJSON: JSON = JSON.parse('{"userName":"Blofeld", "password":"12345"}')


    const observable = this.backendService.getSessionID(testJSON);

    console.log(observable)




  }

}
