import { Subject, PostDeletedEvent, Publisher } from "@akbar0102/common";

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
  subject: Subject.PostDeleted = Subject.PostDeleted;
}
