import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Poll} from "../../data-access/models/Poll";
import {BackendService} from "../../data-access/service/backend.service";
import {Router} from "@angular/router";

import {AuthenticationService} from "../../data-access/service/authentication.service";

@Component({
  selector: 'vote',
  templateUrl: './Poll.component.html',
  styleUrls: ['./Poll.component.css'],
})
export class PollComponent {
  @Input() voteObject: Poll;

  lowlifetime: boolean = false;
  datum: Date;
  voteisfinish: boolean = false;
  @Output()
  deletePollEvent = new EventEmitter<Poll>();
  @Output()
  showPollResultEvent = new EventEmitter<Poll>();

  constructor (private backendService: BackendService, private router: Router, private authService: AuthenticationService) {}


  showVoteResult(): void {
    if(this.voteisfinish == true){
      this.router.navigate(['/result']);
      localStorage.setItem("clickedPoll", JSON.stringify(this.voteObject));
    }
  }

  showVoteName(): String{
    return this.voteObject.name;
  }


  showVoteLifetime(): string{
    const thelifetime = new Date(this.voteObject.lifetime);
    var today = new Date();

    var milisec = thelifetime.getTime() - today.getTime();
    let days = Math.floor(milisec/86400000);
    var leftover = milisec%86400000;
    let hours = Math.floor(leftover/3600000);
    leftover = leftover%3600000;
    let minutes = Math.floor(leftover/ 60000);
    leftover = leftover%60000;
    let seconds = Math.floor(leftover / 1000);

    if(days == 0&& hours ==0 && minutes <= 45)this.lowlifetime = true;
    if(milisec <=0){
      this.lowlifetime = true;
       this.voteisfinish = true;
      return "FINISH";
    }

    var result =  days + 'd' + hours + 'h' + minutes + 'm' + seconds +'s' ;

    return result;
  }

  stopthisVote(): void{
  }

  deletethisVote(): void{
    this.deletePollEvent.emit(this.voteObject);
  }



}
