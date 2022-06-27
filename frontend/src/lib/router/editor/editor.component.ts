import {Component, OnInit} from "@angular/core";
import {Question} from "../../data-access/models/question";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {Poll} from "../../data-access/models/Poll";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})

export class EditorComponent implements OnInit{

  constructor(private cryptService: EncryptionService, private backendService: BackendService, private authService: AuthenticationService){}
  poll: Poll;

  listPos?: number;
  next: boolean = false;
  tempEmail?: string;
  notAllFilled: boolean = false;
  submitted: boolean = false;
  back: boolean = false;

  addEmptyQuestion() {
    this.poll.questions.forEach(q => q.visible = false);
    let question: Question = {id: 1, title: "",type:"", visible: true};
    this.listPos = this.poll.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.poll.questions[this.listPos - 1].id + 1;

  }

  deleteQuestion(question: Question){
    this.poll.questions = this.poll.questions.filter((q) => q != question);
  }

  showQuestion(question: Question) {
    this.poll.questions.forEach(q => q.visible = false);
    this.poll.questions.forEach(q => (q == question) ? q.visible = true : false);
  }
  addEmail(){
    if(this.isValidEmail()) return;
      this.poll.emails.push(this.tempEmail);
      this.tempEmail='';
  }

  private isValidEmail(): boolean {
    return this.tempEmail == '' || this.tempEmail == undefined || !this.tempEmail.includes('@') || !this.tempEmail.includes('.');
  }

  deleteEmail(email: string){
    this.poll.emails = this.poll.emails.filter((e) => e != email);
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
      this.poll.publicKey = keyPair.publicKey;
      let textFile =
        +"\n \n This is the generated private key for this survey. Please save it somewhere inaccessible for others:\n \n"
        + "\t\t"+priv+"\t\t"
        +"\n\n You will need it for accessing the results of this survey. Please close this window, after you copied and saved the key.";
      var data = new Blob([textFile], {type: 'text/plain'});
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      window.open(textFile);
      this.backendService.createPoll(this.poll).subscribe(response => this.authService.updateSessionid(response["Session ID"]));
    }
    pressOkayButton(){
      this.notAllFilled = false;
    }

  ngOnInit(): void {
    this.poll = {
        name: "",
        lifetime: "",
        questions: [{id: 1, title: "",type:"", visible: true}],
        emails: []
      }
    };

    isCompleteVote(): boolean{
      let result: boolean = true;
      if(this.poll.name == "" || this.poll.lifetime == ""){
        result = false;
      }
      for(let q of this.poll.questions){
        if(q.type == "" || q.title == "") result = false;
      }
      if (this.poll.emails.length == 0) result = false;
      return result;

    }
}
