import {Component, OnInit} from "@angular/core";
import {Question} from "../../data-access/models/question";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})

export class EditorComponent implements OnInit{

  constructor(private cryptService: EncryptionService, private backendService: BackendService){}
  vote: Vote;

  listPos?: number;
  next: boolean = false;
  tempEmail?: string;
  notAllFilled: boolean = false;
  submitted: boolean = false;


  addEmptyQuestion() {
    this.vote.questions.forEach(q => q.visible = false);
    let question: Question = {id: 1, title: "",type:"", visible: true};
    this.listPos = this.vote.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.vote.questions[this.listPos - 1].id + 1;

  }

  deleteQuestion(question: Question){
    this.vote.questions = this.vote.questions.filter((q) => q != question);
  }

  showQuestion(question: Question) {
    this.vote.questions.forEach(q => q.visible = false);
    this.vote.questions.forEach(q => (q == question) ? q.visible = true : false);
  }
  addEmail(){
    if(this.tempEmail == '' || this.tempEmail == undefined || !this.tempEmail.includes('@') || !this.tempEmail.includes('.')) return;
      this.vote.emails.push(this.tempEmail);
      this.tempEmail='';
  }
  deleteEmail(email: string){
    this.vote.emails = this.vote.emails.filter((e) => e != email);
  }

  deleteEverything(){
    this.vote = {
        name: "",
        lifetime: "",
        questions: [{id: 1, title: "New Question",type:"", visible: true}],
        emails: []
      };
    this.submitted = false;
  }

    submitPoll(){

    if(!this.isCompleteVote()){
      this.notAllFilled = true;
      this.submitted = false;
      return;
    }

      this.submitted =true;
      const keyPair = this.cryptService.generateKeyPair();
      const priv = keyPair.privateKey;
      const pub = keyPair.publicKey;
      const encrypted = this.cryptService.encrypt(pub, this.vote);
      let textFile =
        "Vote:\n\n"+
        JSON.stringify(this.vote)+

        "\nEncrypted Message:"
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
      this.backendService.createPoll(this.vote).subscribe(r => console.log(r));
    }
    pressOkayButton(){
      this.notAllFilled = false;
    }

  ngOnInit(): void {
    this.vote = {
        name: "",
        lifetime: "",
        questions: [{id: 1, title: "",type:"", visible: true}],
        emails: []
      }
    };

    isCompleteVote(): boolean{
      let result: boolean = true;
      if(this.vote.name == "" || this.vote.lifetime == ""){
        result = false;
      }
      for(let q of this.vote.questions){
        if(q.type == "" || q.title == "") result = false;
      }
      if (this.vote.emails.length == 0) result = false;
      return result;

    }
}
