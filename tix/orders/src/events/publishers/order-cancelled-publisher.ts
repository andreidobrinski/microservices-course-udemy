import { Publisher, OrderCancelledEvent, Subjects } from '@course-learning-ad/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}