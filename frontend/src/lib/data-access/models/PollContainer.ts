import { Poll } from "./Poll";

export interface PollContainer {
  name?: string;
  votes: Poll[];
}
