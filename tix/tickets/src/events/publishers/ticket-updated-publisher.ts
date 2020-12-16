import { Publisher, Subjects, TicketUpdatedEvent } from '@course-learning-ad/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}