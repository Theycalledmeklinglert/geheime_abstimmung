import {Component, Input} from "@angular/core";
import {Question} from "../data-access/models/question";


@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})

export class QuestionComponent{

 @Input()
  question: Question;

 fixedAnswers: boolean = false;

 chooseFixedAnswers(){
   this.question.yesNo = false;
    this.fixedAnswers = true;
    console.log("Chose fixed answers");
 }
 chooseYesNoAnswer(){
   this.fixedAnswers = false;
   this.question.yesNo = true;
 }
}


