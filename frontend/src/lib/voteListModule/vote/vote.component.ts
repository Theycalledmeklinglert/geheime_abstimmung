import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Vote} from "../../data-access/vote";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent {
  @Input() voteObject: Vote;



  showvoteinfo:boolean = false;


  showVoteResult(): void {
    this.showvoteinfo = true;
  }

  showVoteName(): String{
    return this.voteObject.name;
  }


  showVoteLifetime(): String{
    return this.voteObject.lifetime;
  }

  stopthisVote(): void{
  }

  deletethisVote(): void{
  }



}
