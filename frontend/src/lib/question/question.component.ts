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
 tempAnswer?: string;

 chooseFixedAnswers(){
   this.question.yesNo = false;
   this.question.individualAnswer = undefined;
   this.fixedAnswers = true;
 }
 chooseYesNoAnswer(){
   this.fixedAnswers = false;
   this.question.yesNo = true;
   this.question.individualAnswer = undefined;
 }
 chooseIndividualAnswers(){
  this.fixedAnswers = false;
  this.question.yesNo = false;
  this.question.individualAnswer = 'yes';
 }
 deleteAnswer(answer: string){
   this.question.fixedAnswers = this.question.fixedAnswers.filter((a) => a != answer);
 }
 addAnswer(){
   if(this.question.fixedAnswers == undefined) this.question.fixedAnswers = [];
   if(this.tempAnswer == '' || this.tempAnswer == undefined) return;
   this.question.fixedAnswers.push(this.tempAnswer);
 }
}


