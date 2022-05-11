import { Component, OnInit } from '@angular/core';
import { Question } from 'src/lib/data-access/models/question';
import { Vote } from 'src/lib/data-access/models/vote';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  vote:Vote;

  constructor() { }

  ngOnInit(): void {
    this.loadTestQuestions(); //Platzhalter zum testen bis Backendanbindung funktioniert
  }

  consoleLogging():void {

    this.vote.questions.forEach(question => console.log(question.title));
  }

  submitSurvey():void{

  }

  loadTestQuestions():void {
    this.vote= {name:"Testumfrage", lifetime:"1650250688", questions:[]};
    this.vote.questions.push({title:"FrageText1", id:1,yesNo:false});
    this.vote.questions.push({title:"FrageText2", id:2, fixedAnswers:["AntwortText1", "AntwortText2","AntwortText3"]});
    this.vote.questions.push({title:"FrageText3", id:3, individualAnswer:""});
  }

}
