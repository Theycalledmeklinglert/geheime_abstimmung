import {Question} from "./question";

export interface Poll {
  _id?: number;
  name: string;
  lifetime: string;
  questions?: Question[];
  emails?: string[];
  publicKey?: string;
}
