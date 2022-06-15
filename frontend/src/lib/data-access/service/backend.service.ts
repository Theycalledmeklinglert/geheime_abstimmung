import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Poll } from '../models/Poll';
import { EncryptionService } from './encryption.service';
import {Answer} from "../models/answer";
import {EncryptedData} from "../models/encryptedData";


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  readonly url = 'http://localhost:4200';

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService) { }

  private getSessionID():string{
    return localStorage.getItem("sessionID");
  }

  loadAllPollsByUser(): Observable<JSON> {

    return this.httpClient.get<JSON>(this.url + '/api/polls?sessionID='+ this.getSessionID());
  }

  loadAllUseryBySysadmin(): Observable<JSON> {

    return this.httpClient.get<JSON>(this.url + '/api/polls/users?sessionID='+ this.getSessionID());
  }


  loadPollByUser(pollId: number): Observable<Poll> {

    return this.httpClient.get<Poll>( this.url + '/api/polls/ '+ pollId +'?sessionID='+ this.getSessionID() );
  }

  createPoll(poll: Poll):Observable<Poll> {
    return this.httpClient.post<Poll>(this.url +'/api/polls?sessionID='+ this.getSessionID() ,poll)
    }


  deletePollByID(pollId: number):Observable<JSON>  {

    return this.httpClient.delete<JSON>( this.url + '/api/polls?pollID='+ pollId +'&sessionID='+ this.getSessionID() );

  }


  //temp any!!!!!!!!!!!!!!!!!!!
  loadAlreadyUsedEmails():Observable<any> {

    return this.httpClient.get<any>( this.url + '/api/emails?sessionID='+ this.getSessionID() );
  }

  keyExchange(keyandemail: JSON): Observable<any>{
    return this.httpClient.post(this.url +'/api/polls/connect',keyandemail);
  }

  loadSessionID(myUserData: JSON): Observable<any> {

    return this.httpClient.post<any>( this.url + '/api/polls/session' , myUserData );
  }


  deleteUser(userName: string):Observable<JSON> {

    return this.httpClient.delete<JSON>(this.url + '/api/polls/users?userName=' + userName + '&sessionID=' + this.getSessionID());

  }

  addnewSurveLeader(newUserData: JSON): Observable<JSON>{
    return this.httpClient.post<JSON>(this.url + '/api/polls/users?sessionID='+ this.getSessionID(),newUserData);
  }

  getUsernameofsurveyLeader():string{
    return "No Connection";
  }

  updatePasswordorUsernameSurveyLeader(newUserData: JSON): Observable<JSON>{
    return this.httpClient.put<JSON>(this.url + '/api/polls/users?sessionID='+ this.getSessionID(), newUserData);
  }

  loadPollByID(token:string, id:number):Observable<Poll> {
    return this.httpClient.get<Poll>(this.url + '/api/polls/answers/' + id + '?token=' + token);
  }

  submitSurvey(answers: EncryptedData, token: string, id:string){
    console.log(JSON.stringify(answers));
    const testUrl = this.url + '/api/polls/answers/' + id + '?token=' + token;
    console.log(testUrl);
    return this.httpClient.post<void>(testUrl, answers);
  }


  setNewVote(vote: Poll): void{
  }


}
