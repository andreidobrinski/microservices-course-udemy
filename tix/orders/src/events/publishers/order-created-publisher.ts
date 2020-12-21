import { Publisher, OrderCreatedEvent, Subjects } from '@course-learning-ad/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}