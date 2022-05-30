
export interface Question{
  id: number;
  title: string;
  description?: string;
  type: string;

  yesNo?: boolean;
  fixedAnswers?: string[];
  multipleChoiceAnswer?: boolean[]
  individualAnswer?: string;

  visible?:boolean;
}



