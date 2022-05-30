import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";
import {Router} from "@angular/router";
import {stringify} from "@angular/compiler/src/util";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent {
  @Input() voteObject: Vote;

  lowlifetime: boolean = false;
  datum: Date;
  voteisfinish: boolean = true;
  @Output()
  deleteVoteEvent: EventEmitter<Vote>;

  constructor (private backendService: BackendService, private router: Router) {}


  showVoteResult(): void {
    if(this.voteisfinish == true){
      this.router.navigate(['/result']);
    }
  }

  showVoteName(): String{
    return this.voteObject.name;
  }


  showVoteLifetime(): number{
    /*
     this.datum = new Date(this.voteObject.lifetime);
    if(this.datum.getDay() < 1){this.lowlifetime = true;}
     */
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var todayis = Date.parse( mm + '/' + dd + '/' + yyyy);
    console.log(todayis);
    let testdate = new Date("09/30/2021");
    console.log(Date.parse(this.voteObject.lifetime));
    var diff = Math.abs( Date.parse(this.voteObject.lifetime)-todayis);
    console.log("Diff: "+ diff);
    return diff;
  }

  stopthisVote(): void{
  }

  deletethisVote(): void{
    console.log("delete this Vote!");
    this.deleteVoteEvent.emit(this.voteObject);
  //  this.backendS.deleteSurvey(this.voteObject.id,localStorage.getItem("sessionid"))
  }



}
