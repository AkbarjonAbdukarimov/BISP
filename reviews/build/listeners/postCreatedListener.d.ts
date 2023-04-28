import { Listener, PostCreatedEvent, Subject } from "@akbar0102/common";
import { Message } from "node-nats-streaming";
export declare class PostCreatedListener extends Listener<PostCreatedEvent> {
    subject: Subject.PostCreated;
    queueGroupName: string;
    onMessage(data: PostCreatedEvent["data"], msg: Message): Promise<void>;
}
