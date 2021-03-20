/* eslint-disable no-process-exit */
import * as dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

const {QUEUE_URL} = process.env;
const q = 'hello';

let conn = null;
async function start() {
  try {
    conn = await amqp.connect(QUEUE_URL);
    const ch = await conn.createChannel();
    ch.assertQueue(q, {durable: false});
    setInterval(() => {
      const msg = `${Date.now()}`;
      ch.sendToQueue(q, Buffer.from(msg), {persistent: true});
      console.log(`Message sent:\n${msg}\n`);
    }, 1e3);
  } catch (error) {
    await conn.close();
    console.warn(error);
    process.exit(1);
  }
}
start();

// Marking messages as persistent doesn't fully guarantee that a message won't be lost. Although it tells RabbitMQ to save the message to disk, there is still a short time window when RabbitMQ has accepted a message and hasn't saved it yet. Also, RabbitMQ doesn't do fsync(2) for every message -- it may be just saved to cache and not really written to the disk. The persistence guarantees aren't strong, but it's more than enough for our simple task queue. If you need a stronger guarantee then you can use publisher confirms.
