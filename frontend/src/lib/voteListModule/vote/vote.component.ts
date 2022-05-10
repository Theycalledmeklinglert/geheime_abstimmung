import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Vote} from "../../data-access/models/vote";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent {
  @Input() voteObject: Vote;

  lowlifetime: boolean;


  showvoteinfo:boolean = false;


  showVoteResult(): void {
    this.showvoteinfo = true;
  }

  showVoteName(): String{
    return this.voteObject.name;
  }


  showVoteLifetime(): String{
    /*
    if (this.voteObject.lifetime < 3 days){
      this.lowlifetime = true;
    }
     */
    return this.voteObject.lifetime;
  }

  stopthisVote(): void{
  }

  deletethisVote(): void{
    console.log("delete this Vote!");
  }



}
