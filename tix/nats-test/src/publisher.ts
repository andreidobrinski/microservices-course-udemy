import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

// test implementation

// stan.on('connect', () => {
//   console.log('Publisher connected to NATS');

//   const data = {
//     id: '123',
//     title: 'concert',
//     price: 20
//   };

//   const jsonData = JSON.stringify(data);

//   stan.publish('ticket:created', jsonData, () => {
//     console.log('Event published');
//   });
// });

stan.on('connect', () => {
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });
});