import { Publisher, Subjects, TicketCreatedEvent } from '@course-learning-ad/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}