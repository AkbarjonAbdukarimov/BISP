import {
  PostCreatedEvent,
  Publisher,
  ReviewCreatedEvent,
  Subject,
} from "@akbar0102/common";

export class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
  subject: Subject.ReviewCreated = Subject.ReviewCreated;
}
