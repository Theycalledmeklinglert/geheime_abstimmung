import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vote } from '../models/vote';
import { EncryptionService } from './encryption.service';


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

  loadPollByUser(pollId: number): Observable<Vote> {

    return this.httpClient.get<Vote>( this.url + '/api/polls/ '+ pollId +'?sessionID='+ this.getSessionID() );
  }

  createPoll(poll: JSON):Observable<Vote> {
    return this.httpClient.post<Vote>(this.url +'/api/polls?sessionID='+ this.getSessionID() ,poll)
    }


  deletePollByID(pollId: number):Observable<void>  {

    return this.httpClient.delete<void>( this.url + '/api/polls/ '+ pollId +'/sessionID='+ this.getSessionID() );

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

  loadPollByID(token:string, id:number):Observable<Vote> {
    return this.httpClient.get<Vote>(this.url + '/api/polls/answers?token=' + token + '&pollID=' + id);
  }

  submitSurvey(answeredPoll: Vote, token: string){

    let encryptedData = this.encryptionService.encrypt(localStorage.getItem("publicKey"), answeredPoll)

    return this.httpClient.post<Vote>(this.url + '/api/answers?token=' + token, encryptedData)
  }


  setnewVote(): void{
  }


}

