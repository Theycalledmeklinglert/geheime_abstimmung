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
export class PollConainterComponent implements OnInit{
  vlcObject?: PollContainer;
  newListIndex?: number;
  sureDeletePoll: boolean = false;
  tempPoll: Poll;

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}



  ngOnInit(): void{
    this.vlcObject = {name:"testcontainer", polls:[] };
    this.backendService.loadAllPollsByUser().subscribe((response) =>{
      this.vlcObject.polls = response["polls"];
      this.authService.updateSessionid(response["Session ID"]);
    });
  }



  setVotes(votes: Poll[]){
    this.vlcObject.polls = votes;
  }

  realydelete(poll: Poll){
    this.sureDeletePoll = true;
    this.tempPoll = poll;
    console.log("Are you Sure to Delete?")
  }
  yessDelete(){
    this.vlcObject.polls = this.vlcObject.polls.filter(v => v != this.tempPoll);
    console.log("delete this Poll!");

    this.backendService.deletePollByID(this.tempPoll._id).subscribe((response) =>{
      this.authService.updateSessionid(response["Session ID"]);
      console.log("Delete Response: "+localStorage.getItem("sessionID"));
      this.sureDeletePoll = false;
      }
    );

  }

  noSkipDelete(){
    this.tempPoll = null;
    this.sureDeletePoll = false;
  }

  deleteVote(poll: Poll){
    this.realydelete(poll);
  }

}
