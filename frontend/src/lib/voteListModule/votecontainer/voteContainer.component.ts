import { Component, OnInit } from '@angular/core';

import { VoteContainer } from '../../data-access/models/voteContainer';
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";

@Component({
  selector: 'voteContainer',
  templateUrl: './voteContainer.component.html',
  styleUrls: ['./voteContainer.component.css'],
})
export class VoteConainterComponent implements OnInit{
  vlcObject?: VoteContainer;
  newListIndex?: number;

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.vlcObject = {name:"testcontainer", votes:[] };
    this.backendService.loadAllPollsByUser().subscribe((response) =>{
      this.vlcObject.votes = response["polls"];
      this.authService.updateSessionid(response["Session ID"])
    }
    );
  }


  setVotes(votes: Vote[]){
    this.vlcObject.votes = votes;
  }



}
