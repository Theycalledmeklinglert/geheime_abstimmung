import { Component, OnInit } from '@angular/core';
import {Vote} from "../../data-access/vote";
import { VoteContainer } from '../../data-access/voteContainer';
import { VoteComponent } from '../vote/vote.component';
@Component({
  selector: 'voteContainer',
  templateUrl: './voteContainer.component.html',
  styleUrls: ['./voteContainer.component.css'],
})
export class VoteConainterComponent {
  vlcObject?: VoteContainer;

  newListIndex?: number;


  generatetestvotes(): void{
    this.vlcObject = {name:"testvotecontainer", votes:[]};
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



}
