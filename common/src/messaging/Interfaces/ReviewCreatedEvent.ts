import { Subject } from "../subjects/Subjects";

export interface ReviewCreatedEvent {
  subject: Subject.ReviewCreated;
  data: {
    id: String;
    postId: String;
    reating: Number;
    review: String;
    author: String;
    version: Number;
  };
}
