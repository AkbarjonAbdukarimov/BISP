import { PostCreatedEvent, Publisher } from "@akbar0102/common";
import Subject from "@akbar0102/common/build/messaging/subjects/Subjects";

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: Subject.PostCreated = Subject.PostCreated;
}
