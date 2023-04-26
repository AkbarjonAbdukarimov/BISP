import { Subject, PostUpdatedEvent, Publisher } from "@akbar0102/common";

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  subject: Subject.PostUpdated = Subject.PostUpdated;
}
