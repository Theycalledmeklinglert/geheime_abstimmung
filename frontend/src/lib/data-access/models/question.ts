import {EncryptedData} from "./encryptedData";
import {Answer} from "./answer";

export interface Question{
  id: number;
  title: string;
  description?: string;
  type: string;

  yesNo?: boolean;
  fixedAnswers?: string[];
  multipleChoiceAnswer?: boolean[]
  individualAnswer?: string;
  encryptedAnswers?: Answer[];

  visible?:boolean;
}



