import { Listener, ReviewCreatedEvent, Subject } from "@akbar0102/common";
import { Message } from "node-nats-streaming";
export declare class ReviewCreatedListener extends Listener<ReviewCreatedEvent> {
    subject: Subject.ReviewCreated;
    queueGroupName: string;
    onMessage(data: ReviewCreatedEvent["data"], msg: Message): Promise<void>;
}
