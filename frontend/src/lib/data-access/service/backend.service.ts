import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteContainer } from '../models/voteContainer';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  readonly url = 'http://localhost:8080/demo/api/polls';

  constructor(private httpClient: HttpClient) { }

  getVotecontainerofsurveyLeader(id: number): Observable<VoteContainer> {
      return this.httpClient.get<VoteContainer>(this.url + '/'+ id);

  }

  getUsernameofsurveyLeader():string{
    return "No Connection";
  }

  setpasswordofSurveyLeader(): void{
  }

  setSurveyLeader(): void{
  }

  deleteSurveyLeader(): void{
  }

  setnewVote(): void{
  }

  postPublicKey(myPublicKey: JSON): JSON{
    let test: JSON = JSON.parse("Serverresponse");
    return test;
  }

  getSessionID(myUserData: JSON): string{
    let sessionID:string = "No Response";

    this.httpClient.post<any>( this.url + '/session' , myUserData ).subscribe((response) => {
      sessionID = response["Session ID"];

    });

    console.log(sessionID);

    return sessionID;
  }



}

