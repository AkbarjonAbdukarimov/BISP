import { Subject, PostDeletedEvent, Publisher } from "@akbar0102/common";
export declare class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
    subject: Subject.PostDeleted;
}
