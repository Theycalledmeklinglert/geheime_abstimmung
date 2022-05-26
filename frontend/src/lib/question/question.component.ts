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
   this.question.type="yesNoAnswer";
   this.fixedAnswers = true;
 }
 chooseYesNoAnswer(){
   this.question.type="yesNoAnswer";
   this.fixedAnswers = false;
 }
 chooseIndividualAnswers(){
  this.question.type="individualAnswer";
  this.fixedAnswers = false;
 }
 deleteAnswer(answer: string){
   this.question.fixedAnswers = this.question.fixedAnswers.filter((a) => a != answer);
 }
 addAnswer(){
   if(this.question.fixedAnswers == undefined) this.question.fixedAnswers = [];
   if(this.tempAnswer == '' || this.tempAnswer == undefined) return;
   this.question.fixedAnswers.push(this.tempAnswer);

   this.tempAnswer="";
 }
}


