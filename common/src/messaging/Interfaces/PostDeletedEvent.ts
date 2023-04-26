import Subject from "../subjects/Subjects";

export interface PostDeletedEvent {
  subject: Subject.PostDeleted;
  data: {
    id: string;

    author: string;
  };
}
