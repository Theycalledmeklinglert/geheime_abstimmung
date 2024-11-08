import {Component, OnInit} from "@angular/core";
import {Question} from "../../data-access/models/question";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {Poll} from "../../data-access/models/Poll";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {ClipboardService} from "ngx-clipboard";

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})

export class EditorComponent implements OnInit {

  poll: Poll;
  listPos?: number;
  tempEmail?: string;
  notAllFilled: boolean = false;
  submitted: boolean = false;
  back: boolean = false;
  triesToSubmit: boolean = false;
  privateKey: string;
  copied: boolean = false;
  tabIndex: number = 0;

  constructor(private cryptService: EncryptionService,
              private backendService: BackendService,
              private authService: AuthenticationService,
              private clipboardService: ClipboardService) {
  }

  ngOnInit(): void {
    this.poll = {
      name: "",
      lifetime: "",
      questions: [{id: 1, title: "", type: "", visible: true}],
      emails: []
    }
  }

  addEmptyQuestion() {
    this.poll.questions.forEach(q => q.visible = false);
    let question: Question = {id: 1, title: "", type: "", visible: true};
    this.listPos = this.poll.questions.push(question) - 1;
    question.id = (this.listPos == 0) ? 1 : this.poll.questions[this.listPos - 1].id + 1;
  }

  deleteQuestion(question: Question) {
    this.poll.questions = this.poll.questions.filter((q) => q != question);
  }

  showQuestion(question: Question) {
    this.poll.questions.forEach(q => q.visible = false);
    this.poll.questions.forEach(q => (q == question) ? q.visible = true : false);
  }

  addEmail() {
    if (this.isValidEmail()) return;
    this.poll.emails.push(this.tempEmail);
    this.tempEmail = '';
  }

  private isValidEmail(): boolean {
    return this.tempEmail == '' || this.tempEmail == undefined || !this.tempEmail.includes('@') || !this.tempEmail.includes('.');
  }

  deleteEmail(email: string) {
    this.poll.emails = this.poll.emails.filter((e) => e != email);
  }

  pressSubmitButton() {
    if (!this.isCompleteVote()) {
      this.notAllFilled = true;
      return;
    }
    this.triesToSubmit = true;
  }

  submitPoll() {
    this.submitted = true;
    const keyPair = this.cryptService.generateKeyPair();
    this.privateKey = keyPair.privateKey;
    this.poll.publicKey = keyPair.publicKey;
    this.backendService.createPoll(this.poll).subscribe(response => this.authService.updateSessionid(response["Session ID"]));
  }

  pressOkayButton() {
    this.notAllFilled = false;
  }

  async copyPrivateKeyToClipboard() {
    this.clipboardService.copyFromContent(this.privateKey);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  isCompleteVote(): boolean {
    let result: boolean = true;
    if (this.poll.name == "" || this.poll.lifetime == "") {
      result = false;
    }
    for (let q of this.poll.questions) {
      if (q.type == "" || q.title == "") result = false;
    }
    if (this.poll.emails.length == 0) result = false;
    return result;
  }

  async retrieveEmails() {
    await this.backendService.loadAlreadyUsedEmails().subscribe(result => {
      if (result["E-Mails"]) this.poll.emails = result["E-Mails"];
      if (result["Session ID"]) this.authService.updateSessionid(result["Session ID"]);
    });
  }
}
