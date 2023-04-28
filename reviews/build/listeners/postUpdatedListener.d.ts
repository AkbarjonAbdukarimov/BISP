import { Listener, PostUpdatedEvent, Subject } from "@akbar0102/common";
import { Message } from "node-nats-streaming";
export declare class PostUpdatedListener extends Listener<PostUpdatedEvent> {
    subject: Subject.PostUpdated;
    queueGroupName: string;
    onMessage(data: PostUpdatedEvent["data"], msg: Message): Promise<void>;
}
