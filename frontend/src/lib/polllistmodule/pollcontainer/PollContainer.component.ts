import { Component, OnInit } from '@angular/core';

import { PollContainer } from '../../data-access/models/PollContainer';
import {Poll} from "../../data-access/models/Poll";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'voteContainer',
  templateUrl: './PollContainer.component.html',
  styleUrls: ['./PollContainer.component.css'],
})
export class VoteConainterComponent implements OnInit{
  vlcObject?: PollContainer;
  newListIndex?: number;

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}



  ngOnInit(): void{
    this.vlcObject = {name:"testcontainer", votes:[] };
    console.log("PollContainer->"+"OLDKEY: "+localStorage.getItem("sessionID"));
    this.backendService.loadAllPollsByUser().subscribe((response) =>{
      this.vlcObject.votes = response["polls"];
      this.authService.updateSessionid(response["Session ID"]);
      console.log("PollContainer->"+"NEWKEY: "+localStorage.getItem("sessionID"));
    });
  }



  setVotes(votes: Poll[]){
    this.vlcObject.votes = votes;
  }

  deleteVote(vote: Poll){
    this.vlcObject.votes = this.vlcObject.votes.filter(v => v != vote);
  }

}
