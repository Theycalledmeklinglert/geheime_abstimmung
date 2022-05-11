import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../data-access/models/question';
import { Vote } from '../data-access/models/vote';

@Component({
  selector: 'surveyQuestion',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.css']
})
export class SurveyQuestionComponent implements OnInit {

  @Input() question:Question;

  constructor() { }

  ngOnInit(): void {
  }

  setAnswer(event:any):void {
    this.question.individualAnswer = event.target.value;
  }

}
