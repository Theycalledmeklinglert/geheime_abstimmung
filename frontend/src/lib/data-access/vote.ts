import {Question} from "./question";

export interface Vote{
  id?: number;
  name: string;
  lifetime?: string;
  position?: number;
  questions?: Question[];
}
