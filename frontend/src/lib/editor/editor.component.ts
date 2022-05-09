import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Editor } from "../data-access/editor";
import {Question} from "../data-access/question";


@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})

export class EditorComponent {

  // constructor(private appService: AppService){}
  editor?: Editor = {
    vote: {
      name: "TESTVOTE",
      lifetime: "1d17h10s",
      questions: [{id: 1, title: "Wie geht's dir?", visible: true}, {
        id: 2,
        title: "Wollen wir Bier trinken gehen?",
        visible: false
      }]
    }
  };
  listPos?: number;

  // focus: boolean = false;


  addEmptyQuestion() {
    this.editor.vote.questions.forEach(q => q.visible = false);
    let question: Question = {id: 4, title: "new Question", visible: true};
    this.listPos = this.editor.vote.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.editor.vote.questions[this.listPos - 1].id + 1;

  }

//   deleteList(id: number){
//     this.app.lists = this.app.lists.filter((list) => list.id != id);
//     this.appService.deleteList(id).subscribe();
//   }

  showQuestion(question: Question) {
    this.editor.vote.questions.forEach(q => q.visible = false);
    this.editor.vote.questions.forEach(q => (q == question) ? q.visible = true : false);
  }
}
