import {
  Listener,
  NotFoundError,
  ReviewCreatedEvent,
  Subject,
} from "@akbar0102/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queGroup";
import Post from "../models/Review";
import { PostUpdatedPublisher } from "../publisher/postUpdated";

export class ReviewCreatedListener extends Listener<ReviewCreatedEvent> {
  subject: Subject.ReviewCreated = Subject.ReviewCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ReviewCreatedEvent["data"], msg: Message) {
    const post = await Post.findById(data.postId);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    post.reviews.push({ reviewId: data.id, rating: data.reating });
    await post.save();

    await new PostUpdatedPublisher(this.client).publish({
      id: post.id,
      version: post.version,
      //@ts-ignore
      name: post.name,
      //@ts-ignore
      description: post.description,
      //@ts-ignore
      author: post.author,
    });

    // ack the message
    msg.ack();
  }
}
