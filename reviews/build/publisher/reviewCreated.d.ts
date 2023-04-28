import { Publisher, ReviewCreatedEvent, Subject } from "@akbar0102/common";
export declare class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
    subject: Subject.ReviewCreated;
}
