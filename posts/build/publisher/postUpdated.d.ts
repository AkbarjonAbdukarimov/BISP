import { Subject, PostUpdatedEvent, Publisher } from "@akbar0102/common";
export declare class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
    subject: Subject.PostUpdated;
}
