import { Component} from "@angular/core";
import {Question} from "../data-access/question";


@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})

export class QuestionComponent{

 question: Question = {id: 1, title: "Wie gehts dir?"};


}
