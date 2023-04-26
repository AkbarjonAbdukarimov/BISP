import { PostUpdatedEvent, Publisher } from "@akbar0102/common";
import Subject from "@akbar0102/common/build/messaging/subjects/Subjects";

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  subject: Subject.PostUpdated = Subject.PostUpdated;
}
