import Subject from "../subjects/Subjects";

interface PostCreatedEvent {
  subject: Subject.PostCreated;
  data: {
    id: String;
    name: String;
    author: String;
    _v: Number;
  };
}
export default PostCreatedEvent;
