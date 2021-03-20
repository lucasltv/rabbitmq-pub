/* eslint-disable no-process-exit */
import * as dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

const {QUEUE_URL} = process.env;
const q = 'hello';
const e = 'exchange_test';

async function start(broadCast = false) {
  try {
    const conn = await amqp.connect(QUEUE_URL);
    const ch = await conn.createChannel();
    ch.assertQueue(q, {durable: false});
    ch.assertExchange(e, 'fanout', {durable: false});
    ch.bindQueue(q, e, '');
    setInterval(() => {
      const msg = `${Date.now()}`;
      if (broadCast) {
        // ch.publish(e, q, Buffer.from(msg));
        ch.publish(e, '', Buffer.from(msg)); // The empty string as second parameter means that we don't want to send the message to any specific queue. We want only to publish it to our 'logs' exchange.
      } else {
        ch.sendToQueue(q, Buffer.from(msg), {persistent: true});
      }
      console.log(`Message sent:\n${msg}\n`);
    }, 1e3);
  } catch (error) {
    console.warn(error);
    process.exit(1);
  }
}
start(true);

// Marking messages as persistent doesn't fully guarantee that a message won't be lost. Although it tells RabbitMQ to save the message to disk, there is still a short time window when RabbitMQ has accepted a message and hasn't saved it yet. Also, RabbitMQ doesn't do fsync(2) for every message -- it may be just saved to cache and not really written to the disk. The persistence guarantees aren't strong, but it's more than enough for our simple task queue. If you need a stronger guarantee then you can use publisher confirms.
