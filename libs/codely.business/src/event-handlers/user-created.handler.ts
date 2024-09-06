import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from 'codely/codely.entities/events';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor() {}

  handle(event: UserCreatedEvent) {
    console.log('event handled', event);
  }
}
