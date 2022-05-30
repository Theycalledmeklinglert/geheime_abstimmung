import {Question} from "./question";

export interface Vote{
  _id?: number;
  name: string;
  lifetime: string;
  position?: number;
  questions?: Question[];
  emails?: string[];
}
