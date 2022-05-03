import {Question} from "./question";

export interface Vote{
  id: number;
  questions: Question[];
}
