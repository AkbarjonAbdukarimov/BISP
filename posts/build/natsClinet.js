"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
class NatsClient {
    get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before connecting");
        }
        return this._client;
    }
    connect(clisterId, clientId, url) {
        this._client = node_nats_streaming_1.default.connect(clisterId, clientId, { url });
        return new Promise((resolve, reject) => {
            this._client.on("connect", () => {
                console.log("Connected to NATS");
                resolve();
            });
            this._client.on("error", (e) => {
                console.log("Cannot connect to NATS");
                reject(e);
            });
        });
    }
}
const natsClient = new NatsClient();
exports.default = natsClient;
