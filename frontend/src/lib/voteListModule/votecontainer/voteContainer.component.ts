import { Component, OnInit } from '@angular/core';

import { VoteContainer } from '../../data-access/models/voteContainer';
import {Vote} from "../../data-access/models/vote";
import {BackendService} from "../../data-access/service/backend.service";

@Component({
  selector: 'voteContainer',
  templateUrl: './voteContainer.component.html',
  styleUrls: ['./voteContainer.component.css'],
})
export class VoteConainterComponent implements OnInit{
  vlcObject?: VoteContainer;

  newListIndex?: number;

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.vlcObject = {name:"testcontainer", votes:[{name:"TESTVOTE",lifetime:"1d17h10s"},{name:"Vote2",lifetime:"4d3h25s"},{name:"Vote3",lifetime:"2d12h55s"},{name:"Vote4",lifetime:"29d11h35s"},{name:"Vote5",lifetime:"0d0h55s"},{name:"Vote6",lifetime:"1d7h0s"},{name:"Vote7",lifetime:"1d17h10s"},{name:"Vote8",lifetime:"4d3h25s"},{name:"Vote9",lifetime:"2d12h55s"},{name:"Vote10",lifetime:"29d11h35s"}] };
    //this.vlcObject = this.backendS.getVotecontainerofsurveyLeader()
  }

  generatetestvotes(): void{

  }


  createNewVote(): void {
    /*
    let newVote: Vote = { name: "",};
    this.newListIndex = this.vlcObject.votes.push(newVote) - 1;

    newVote.position = (this.newListIndex === 0)? 1 : this.vlcObject.votes[this.newListIndex -1].position+1;

    this.backendService.createList(newVote).subscribe((vote) => {
      newVote.id = vote.id;
      newVote.position = vote.position;
    });
     */
  }

  setVotes(votes: Vote[]){
    this.vlcObject.votes = votes;
  }





}
