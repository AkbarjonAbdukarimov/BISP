import {
  Listener,
  NotFoundError,
  PostCreatedEvent,
  PostUpdatedEvent,
  Subject,
} from "@akbar0102/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queGroup";
import Post from "../models/Post";

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
  subject: Subject.PostUpdated = Subject.PostUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostUpdatedEvent["data"], msg: Message) {
    const { id, name, author, version } = data;
    //@ts-ignore
    const post = Post.findByEvent({ id, version });
    if (!post) {
      throw new NotFoundError();
    }
    post.set({
      name,
      author,
    });
    await post.save();

    msg.ack();
  }
}
