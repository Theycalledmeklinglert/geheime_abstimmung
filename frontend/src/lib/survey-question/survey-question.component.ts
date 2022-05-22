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
    this.question.multipleChoiceAnswer.fill(false,0,this.question.multipleChoiceAnswer.length);


  }


  updateFixedAnswer(index: number):void {
    this.question.multipleChoiceAnswer[index] = !this.question.multipleChoiceAnswer[index];
  }

  updateYesNoAnswer(): void {

  }

  //temp!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  check(){
    console.log(this.question)
  }

}
