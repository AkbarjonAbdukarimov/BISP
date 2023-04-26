import { PostCreatedEvent, Publisher, Subject } from "@akbar0102/common";

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: Subject.PostCreated = Subject.PostCreated;
}
