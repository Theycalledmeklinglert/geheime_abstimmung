import {Component} from "@angular/core";
import {Editor} from "../../data-access/models/editor";
import {Question} from "../../data-access/models/question";
import {box, randomBytes} from 'tweetnacl';
import {decodeBase64, decodeUTF8, encodeBase64, encodeUTF8} from 'tweetnacl-util';
import {EncryptionService} from "../../data-access/encryption.service";

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})

export class EditorComponent {

  constructor(private cryptService: EncryptionService){}
  editor?: Editor = {
    vote: {
      name: "",
      lifetime: "",
      questions: [{id: 1, title: "New Question", visible: true}],
      emails: []
    }
  };
  // = {
  //   vote: {
  //     name: "TESTVOTE",
  //     lifetime: "1d17h10s",
  //     questions: [{id: 1, title: "Wie geht's dir?", visible: true}, {
  //       id: 2,
  //       title: "Wollen wir Bier trinken gehen?",
  //       visible: false
  //     }],
  //     emails: ["hallo@fhws.de"]
  //   }
  // };
  listPos?: number;
  next: boolean = false;
  tempEmail?: string;
  tempDescr?: string;
  // focus: boolean = false;


  addEmptyQuestion() {
    this.editor.vote.questions.forEach(q => q.visible = false);
    let question: Question = {id: 4, title: "new Question", visible: true};
    this.listPos = this.editor.vote.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.editor.vote.questions[this.listPos - 1].id + 1;

  }

  deleteQuestion(question: Question){
    this.editor.vote.questions = this.editor.vote.questions.filter((q) => q != question);
    // this.appService.deleteList(id).subscribe();
  }

  showQuestion(question: Question) {
    this.editor.vote.questions.forEach(q => q.visible = false);
    this.editor.vote.questions.forEach(q => (q == question) ? q.visible = true : false);
  }
  addEmail(){
    if(this.tempEmail == '' || this.tempEmail == undefined) return;
    this.editor.vote.emails.push(this.tempEmail);
    this.tempEmail='';
  }
  deleteEmail(email: string){
    this.editor.vote.emails = this.editor.vote.emails.filter((e) => e != email);
  }
  submitVote(){
    //http to backend
  }
  deleteEverything(){
    this.editor = {
      vote: {
        name: "",
        lifetime: "",
        questions: [{id: 1, title: "New Question", visible: true}],
        emails: []
      }
    };
  }

    setDescription(){
      console.log(this.tempDescr);
    }
    printEncrypted(){
      let pair = this.cryptService.generateKeyPair();
      let publicKey = pair.publicKey;
      let privateKey = pair.secretKey;
      let textFile = "This is the generated private key for this survey. Please save it somewhere inaccessible for others:\n \n"+privateKey.toString()+"\n\n You will need" +
        " it for accessing the results of this survey";
      var data = new Blob([textFile], {type: 'text/plain'});
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      window.open(textFile);

      console.log(this.cryptService.encryptMessage(publicKey, this.editor));
    }
}
