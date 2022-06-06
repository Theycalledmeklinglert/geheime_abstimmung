import {Question} from "./question";

export interface Poll {
  _id?: number;
  name: string;
  lifetime: string;
  position?: number;
  questions?: Question[];
  emails?: string[];
}
