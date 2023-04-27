import {
  Listener,
  NotFoundError,
  PostDeletedEvent,
  Subject,
} from "@akbar0102/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queGroup";
import Post from "../models/Post";
import Review from "../models/Review";

export class PostDeletedListener extends Listener<PostDeletedEvent> {
  subject: Subject.PostDeleted = Subject.PostDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: PostDeletedEvent["data"], msg: Message) {
    const { id, author } = data;
    //@ts-ignore
    const post = await Post.findByEvent({ id, version });
    if (!post) {
      throw new NotFoundError();
    }
    await Post.deleteOne({ postId: id });
    await Review.deleteMany({ postId: id });
    msg.ack();
  }
}
