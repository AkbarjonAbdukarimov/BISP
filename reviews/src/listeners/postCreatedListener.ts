import { Listener, PostCreatedEvent, Subject } from "@akbar0102/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queGroup";
import Post from "../models/Post";

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  subject: Subject.PostCreated = Subject.PostCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostCreatedEvent["data"], msg: Message) {
    const { id, name, author, version } = data;

    const post = Post.build({
      //@ts-ignore
      id,
      name,
      //@ts-ignore
      author,
      version,
    });
    await post.save();
    let posts = await Post.find();
    console.log(posts);

    msg.ack();
  }
}
