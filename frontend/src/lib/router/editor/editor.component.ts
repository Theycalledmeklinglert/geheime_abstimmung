import {Component} from "@angular/core";
import {Editor} from "../../data-access/models/editor";
import {Question} from "../../data-access/models/question";
import {decodeBase64, encodeBase64, encodeUTF8} from 'tweetnacl-util';
import {EncryptionService} from "../../data-access/service/encryption.service";
import * as nacl from "tweetnacl";

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
      questions: [{id: 1, title: "", visible: true}],
      emails: []
    }
  };

  listPos?: number;
  next: boolean = false;
  tempEmail?: string;
  notAllFilled: boolean = false;
  submitted: boolean = false;


  addEmptyQuestion() {
    this.editor.vote.questions.forEach(q => q.visible = false);
    let question: Question = {id: 1, title: "", visible: true};
    this.listPos = this.editor.vote.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.editor.vote.questions[this.listPos - 1].id + 1;

  }

  deleteQuestion(question: Question){
    this.editor.vote.questions = this.editor.vote.questions.filter((q) => q != question);
  }

  showQuestion(question: Question) {
    this.editor.vote.questions.forEach(q => q.visible = false);
    this.editor.vote.questions.forEach(q => (q == question) ? q.visible = true : false);
  }
  addEmail(){
    if(this.tempEmail == '' || this.tempEmail == undefined || !this.tempEmail.includes('@') || !this.tempEmail.includes('.')) return;
      this.editor.vote.emails.push(this.tempEmail);
      this.tempEmail='';
  }
  deleteEmail(email: string){
    this.editor.vote.emails = this.editor.vote.emails.filter((e) => e != email);
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
    this.submitted = false;
  }

    submitPoll(){

      if(this.editor.vote.name == "" || this.editor.vote.lifetime == ""){
        this.notAllFilled = true;
        this.submitted = false;
        return;
      }
      this.submitted =true;
      const keyPair = this.cryptService.generateKeyPair();
      const priv = keyPair.privateKey;
      const pub = keyPair.publicKey;
      const encrypted = this.cryptService.encrypt(pub, this.editor);
      let textFile =
        "Encrypted Message:"
        +JSON.stringify(encrypted)
        +"\n \n This is the generated private key for this survey. Please save it somewhere inaccessible for others:\n \n"
        // pub+'\n'+
        +priv
        +"\n\n You will need it for accessing the results of this survey. Please close this window, after you copied and saved the key.";
      var data = new Blob([textFile], {type: 'text/plain'});
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      window.open(textFile);

    }
    pressOkayButton(){
      this.notAllFilled = false;
    }
}
