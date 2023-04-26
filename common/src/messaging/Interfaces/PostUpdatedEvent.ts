import { Subject } from "../subjects/Subjects";

export interface PostUpdatedEvent {
  subject: Subject.PostUpdated;
  data: {
    id: string;
    version: number;
    name: string;
    description: string;
    author: string;
  };
}
