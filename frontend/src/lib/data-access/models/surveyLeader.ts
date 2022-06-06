import {PollContainer} from "./PollContainer";
export interface SurveyLeader {
  id?: number;
  username: string;
  password: string;
  currentPolls?: PollContainer;
}
