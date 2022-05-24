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

  async ngOnInit(): Promise<void> {
    console.log("VoteContainer->"+"OLDKEY: "+localStorage.getItem("sessionID"));
    //this.vlcObject = {name:"testcontainer", votes:[] };
    let response = await lastValueFrom(this.backendService.loadAllPollsByUser());
    console.log(response);
    // if(response["polls"]){
    //   this.vlcObject = {name:"testcontainer",votes: response["polls"]};
    //   this.authService.updateSessionid(response["Session ID"]);
    //   console.log("VoteContainer->"+"NEWKEY: "+localStorage.getItem("sessionID"));
    // }
  }


  setVotes(votes: Vote[]){
    this.vlcObject.votes = votes;
  }



}
