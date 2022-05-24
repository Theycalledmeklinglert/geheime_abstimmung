import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveyLeader } from '../models/surveyLeader';
import { Vote } from '../models/vote';
import { VoteContainer } from '../models/voteContainer';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  readonly url = 'http://localhost:4200';

  constructor(private httpClient: HttpClient) { }

  private getSessionID():string{
    return localStorage.getItem("sessionID");
  }

  loadAllPollsByUser(): Observable<JSON> {

    return this.httpClient.get<JSON>(this.url + '/api/polls?sessionID='+ this.getSessionID());

  }


  loadPollByUser(pollId: number): Observable<Vote> {

    return this.httpClient.get<Vote>( this.url + '/api/polls/ '+ pollId +'?sessionID='+ this.getSessionID() );
  }

  createPoll(poll: Vote):Observable<Vote> {
    let data = {
      ...poll,
    }

    return this.httpClient.post<Vote>(this.url + '/api/polls?sessionID='+ this.getSessionID(), data);
  }

  deletePollByID(pollId: number):Observable<void>  {

    return this.httpClient.delete<void>( this.url + '/api/polls/ '+ pollId +'/sessionID='+ this.getSessionID() );

  }


  //temp any!!!!!!!!!!!!!!!!!!!
  loadAlreadyUsedEmails():Observable<any> {

    return this.httpClient.get<any>( this.url + '/api/emails?sessionID='+ this.getSessionID() );

  }

  postPublicKey(myPublicKey: JSON): JSON{
    let test: JSON = JSON.parse("Serverresponse");
    return test;
  }

  loadSessionID(myUserData: JSON): Observable<any> {

    return this.httpClient.post<any>( this.url + '/api/polls/session' , myUserData );

  }


  deleteUser(user: SurveyLeader):Observable<void> {

    return this.httpClient.delete<void>(this.url + '/api/users?userName=' + user.username + '&sessionID=' + this.getSessionID() )

  }

  addnewSurveLeader(newUserData: JSON): Observable<JSON>{
    return this.httpClient.put<JSON>(this.url + '/api/polls/users?sessionID='+ this.getSessionID(),newUserData);
  }

  getUsernameofsurveyLeader():string{
    return "No Connection";
  }

  updatePasswordorUsernameSurveyLeader(newUserData: JSON): Observable<JSON>{

    return this.httpClient.put<JSON>(this.url + '/api/polls/users?sessionID='+ this.getSessionID(),newUserData);
  }

  setSurveyLeader(): void{
  }

  setnewVote(): void{
  }



}

