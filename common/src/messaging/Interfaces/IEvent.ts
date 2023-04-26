import Subject from "../subjects/Subjects";

export interface Event {
  subject: Subject;
  data: any;
}
