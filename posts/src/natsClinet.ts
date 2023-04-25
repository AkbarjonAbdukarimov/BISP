import nats, { Stan } from "node-nats-streaming";
class NatsClient {
  private _client?: Stan;

  connect(clisterId: string, clientId: string, url: string) {
    this._client = nats.connect(clisterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client!.on("error", (e) => {
        console.log("Cannot connect to NATS");
        reject(e);
      });
    });
  }
}
const natsClient = new NatsClient();
export default natsClient;
