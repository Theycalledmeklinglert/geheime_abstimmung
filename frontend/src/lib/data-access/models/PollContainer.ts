import { Poll } from "./Poll";

export interface PollContainer {
  name?: string;
  polls: Poll[];
}
