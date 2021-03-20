"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib");
const url = 'amqps://fynnrolf:pF11ivy4p58KK9SgzQSblhW_v1fWxIDx@chimpanzee.rmq.cloudamqp.com/fynnrolf';
const q = 'hello';
async function publish() {
    try {
        const conn = await amqp.connect(url);
        const ch = await conn.createChannel();
        ch.assertQueue(q, { durable: false });
        const msg = `${Date.now()}`;
        ch.sendToQueue(q, Buffer.from(msg));
        console.log(`Message sent:\n${msg}\n`);
    }
    catch (error) {
        console.warn(error);
    }
}
setInterval(publish, 5e3);
//# sourceMappingURL=index.js.map