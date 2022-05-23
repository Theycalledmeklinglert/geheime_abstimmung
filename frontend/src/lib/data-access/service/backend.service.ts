import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteContainer } from '../models/voteContainer';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  readonly url = 'http://localhost:4200';

  constructor(private httpClient: HttpClient) { }

  getVotecontainerofsurveyLeader(id: number): Observable<VoteContainer> {
      return this.httpClient.get<VoteContainer>(this.url + '/api/polls/id/'+ id);

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

  getSessionID(myUserData: JSON): Observable<any> {

    return this.httpClient.post<any>( this.url + '/api/polls/session' , myUserData );

  }

}

