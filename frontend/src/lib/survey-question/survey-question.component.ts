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


  updateFixedAnswer(index: number, checkBox):void {
    this.question.multipleChoiceAnswer[index] = checkBox.checked;
  }

}
