import { Subject } from "../subjects/Subjects";

export interface PostCreatedEvent {
  subject: Subject.PostCreated;
  data: {
    id: String;
    name: String;
    author: String;
    version: Number;
  };
}
