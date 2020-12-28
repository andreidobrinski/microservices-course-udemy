import { Subjects, Publisher, ExpirationCompleteEvent } from '@course-learning-ad/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}