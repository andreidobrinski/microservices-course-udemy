import { Subjects, Publisher, PaymentCreatedEvent } from '@course-learning-ad/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}