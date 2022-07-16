import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Question } from '../data-access/models/question';

@Component({
  selector: 'surveyQuestion',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.css']
})
export class SurveyQuestionComponent implements OnInit {

  @Input() question:Question;
  @Input() parentForm:FormGroup;

  subGroupFixed: FormGroup;

  constructor() { }

  ngOnInit(): void {

    if(this.question.type ==="fixedAnswer") {
      this.subGroupFixed = new FormGroup({})

      this.question.fixedAnswers.forEach((answer) => this.subGroupFixed.addControl(answer, new FormControl(false)))
      this.subGroupFixed.addValidators( this.fixedAnswerCheck() )

      this.parentForm.addControl(this.question.title,this.subGroupFixed);
    }
    else {
      this.parentForm.addControl(this.question.title, new FormControl(null, Validators.required));
    }

    this.initMultiplechoiceArray();
  }

  fixedAnswerCheck(minRequired = 1): ValidatorFn {
    return  function validate(formGroup: FormGroup) {
      let checked: number = 0;

      Object.keys(formGroup.controls).forEach (key => {
        const control = formGroup.controls[key]

        if (control.value === true) {
          checked ++;
        }
      });

      if (checked < minRequired) {
        return {
          fixedAnswerCheck: true,
        };
      }
      return null;
    };
  }

  initMultiplechoiceArray(): void {
    if(this.question.type == "fixedAnswer") {
      this.question.multipleChoiceAnswer = new Array(this.question.fixedAnswers.length);
      this.question.multipleChoiceAnswer.fill(false);
    }
  }


  updateFixedAnswer(index: number, checked: boolean):void {
    this.question.multipleChoiceAnswer[index] = checked;
  }

  updateCustomAnswer(event: any) {
    this.question.individualAnswer = event.target.value;
  }

  descriptionProvided():boolean {
    return this.question.description!=undefined;
  }

}
