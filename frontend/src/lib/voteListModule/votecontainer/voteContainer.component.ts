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

}
