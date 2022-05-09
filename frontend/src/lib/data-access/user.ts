import {VoteContainer} from "./voteContainer";
export interface User{
  id?: number;
  username: string;
  password: string;
  uservotes?: VoteContainer;
}
