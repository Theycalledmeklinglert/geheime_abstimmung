import { Component, OnInit } from '@angular/core';

import { VoteContainer } from '../../data-access/models/voteContainer';
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'voteContainer',
  templateUrl: './voteContainer.component.html',
  styleUrls: ['./voteContainer.component.css'],
})
export class VoteConainterComponent implements OnInit{
  vlcObject?: VoteContainer;
  newListIndex?: number;

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}



  ngOnInit(): void{
    this.vlcObject = {name:"testcontainer", votes:[] };
    console.log("VoteContainer->"+"OLDKEY: "+localStorage.getItem("sessionID"));
    this.backendService.loadAllPollsByUser().subscribe((response) =>{
      this.vlcObject.votes = response["polls"];
      this.authService.updateSessionid(response["Session ID"]);
      console.log("VoteContainer->"+"NEWKEY: "+localStorage.getItem("sessionID"));
    });
  }

  /*
  async ngOnInit(): Promise<void> {
    console.log("VoteContainer->"+"OLDKEY: "+localStorage.getItem("sessionID"));
    let response = await lastValueFrom(this.backendService.loadAllPollsByUser());
    console.log(response);
    if(response["polls"]){
      this.vlcObject = {name:"testcontainer",votes: response["polls"]};
      this.authService.updateSessionid(response["Session ID"]);
      console.log("VoteContainer->"+"NEWKEY: "+localStorage.getItem("sessionID"));
    } else{
      this.vlcObject = {name:"testcontainer", votes:[] };
    }
  }
   */


  setVotes(votes: Vote[]){
    this.vlcObject.votes = votes;
  }

  deleteVote(vote: Vote){
    this.vlcObject.votes.filter(v => v != vote);
    this.backendService.deletePollByID(vote.id);
  }

}
