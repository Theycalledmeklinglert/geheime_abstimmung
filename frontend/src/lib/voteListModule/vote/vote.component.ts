import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent {
  @Input() voteObject: Vote;

  lowlifetime: boolean = false;
  showvoteinfo:boolean = false;
  datum: Date;

  constructor (private backendService: BackendService) {}


  showVoteResult(): void {

    //  this.backendS.getSurvey(this.voteObject.id,localStorage.getItem("sessionid"))
    this.showvoteinfo = true;
  }

  showVoteName(): String{
    return this.voteObject.name;
  }


  showVoteLifetime(): String{
    /*
     this.datum = new Date(this.voteObject.lifetime);
    if(this.datum.getDay() < 1){this.lowlifetime = true;}
     */

    return this.voteObject.lifetime;
  }

  stopthisVote(): void{
  }

  deletethisVote(): void{
    console.log("delete this Vote!");
  //  this.backendS.deleteSurvey(this.voteObject.id,localStorage.getItem("sessionid"))
  }



}
