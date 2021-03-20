import * as dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

const {QUEUE_URL} = process.env;
const q = 'hello';

async function publish() {
  try {
    const conn = await amqp.connect(QUEUE_URL);
    const ch = await conn.createChannel();
    ch.assertQueue(q, {durable: false});
    const msg = `${Date.now()}`;
    ch.sendToQueue(q, Buffer.from(msg));
    console.log(`Message sent:\n${msg}\n`);
  } catch (error) {
    console.warn(error);
  }
}
setInterval(publish, 5e3);
