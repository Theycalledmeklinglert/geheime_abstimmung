import { Component, OnInit } from '@angular/core';

import { VoteContainer } from '../../data-access/voteContainer';

@Component({
  selector: 'voteContainer',
  templateUrl: './voteContainer.component.html',
  styleUrls: ['./voteContainer.component.css'],
})
export class VoteConainterComponent implements OnInit{
  vlcObject?: VoteContainer;

  newListIndex?: number;

  ngOnInit(): void {
    this.vlcObject = {name:"name", votes:[]};
  }


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
