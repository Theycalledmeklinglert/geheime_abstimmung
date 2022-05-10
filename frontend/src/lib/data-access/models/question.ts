
export interface Question{
  id: number;
  title: string;
  yesNo?: boolean;
  fixedAnswers?: string[];
  individualAnswer?: string;
  visible?:boolean;
}



