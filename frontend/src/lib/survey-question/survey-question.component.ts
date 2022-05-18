import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Question } from '../data-access/models/question';

@Component({
  selector: 'surveyQuestion',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.css']
})
export class SurveyQuestionComponent implements OnInit {

  @Input() question:Question;

  questionForm: FormGroup;
  labelPosition: 'before' | 'after' = 'after';

  constructor() { }

  ngOnInit(): void {


  }

  setAnswer(event:any):void {
    this.question.individualAnswer = event.target.value;
  }

  updateFixedAnswer():void {

  }

  updateYesNoAnswer(): void {
    
  }

}
