import { PostCreatedEvent, Publisher, Subject } from "@akbar0102/common";
export declare class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
    subject: Subject.PostCreated;
}
