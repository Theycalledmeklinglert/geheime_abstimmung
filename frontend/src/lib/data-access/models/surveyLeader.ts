import {VoteContainer} from "./voteContainer";
export interface SurveyLeader {
  id?: number;
  username: string;
  password: string;
  currentPolls?: VoteContainer;
}
