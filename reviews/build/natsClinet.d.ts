import nats from "node-nats-streaming";
declare class NatsClient {
    private _client?;
    get client(): nats.Stan;
    connect(clisterId: string, clientId: string, url: string): Promise<void>;
}
declare const natsClient: NatsClient;
export default natsClient;
