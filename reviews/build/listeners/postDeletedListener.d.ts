import { Listener, PostDeletedEvent, Subject } from "@akbar0102/common";
import { Message } from "node-nats-streaming";
export declare class PostDeletedListener extends Listener<PostDeletedEvent> {
    subject: Subject.PostDeleted;
    queueGroupName: string;
    onMessage(data: PostDeletedEvent["data"], msg: Message): Promise<void>;
}
