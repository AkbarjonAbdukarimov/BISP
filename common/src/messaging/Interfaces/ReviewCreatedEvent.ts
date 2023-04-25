import Subject from "../subjects/Subjects";

interface ReviewCreatedEvent {
  subject: Subject.ReviewCreated;
  data: {
    id: String;
    postId: String;
    reating: Number;
    review: String;
    author: String;
    _v: Number;
  };
}
export default ReviewCreatedEvent;
