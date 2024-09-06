import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CodelyDataModule } from 'codely/codely.data/codely.data.module';
import {
  CommandBus,
  CqrsModule,
  EventBus,
  IEvent,
  QueryBus,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { Mediator, ValidationCommandBus, ValidationQueryBus } from './common';
import { UserCreatedEventHandler } from './event-handlers';
import { Subject, takeUntil } from 'rxjs';
import { CoreModule } from '@app/core';
import { IFirebaseEvent } from 'codely/codely.entities/events';
import { RegisterUserCommandHandler } from './auth/commands';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from './common/mails';
import { Configuration } from './common/config/configuration';
import { ValidateLoginQueryHandler } from './auth/queries';

export const QueryHandlers = [
  ValidateLoginQueryHandler
];
export const CommandHandlers = [
  RegisterUserCommandHandler
];
export const EventHandlers = [UserCreatedEventHandler];

@Module({
  imports: [CqrsModule, CodelyDataModule, CoreModule],
  providers: [
    QueryBus,
    CommandBus,
    JwtService,
    Configuration,
    AuthMailService,
    {
      provide: QueryBus,
      useClass: ValidationQueryBus,
    },
    {
      provide: CommandBus,
      useClass: ValidationCommandBus,
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    Mediator,
  ],
  exports: [
    QueryBus,
    CommandBus,
    Mediator,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class CodelyBusinessModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private unhandledExceptionsBus: UnhandledExceptionBus,
  ) {
    this.eventBus.pipe(takeUntil(this.destroy$)).subscribe((event: IEvent) => {
      if (this.isFireBaseEvent(event)) console.log('allevents', event);
    });

    this.unhandledExceptionsBus
      .pipe(takeUntil(this.destroy$))
      .subscribe((exceptionInfo) => {
        // Handle exception here
        // e.g. send it to external service, terminate process, or publish a new event
        console.log('Event exception', exceptionInfo.exception);
      });
  }

  private destroy$ = new Subject<void>();

  onModuleInit() {
    this.queryBus.register(QueryHandlers);
    this.commandBus.register(CommandHandlers);
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private isFireBaseEvent(event: any): event is IFirebaseEvent {
    const fbEvent = event as IFirebaseEvent;
    return fbEvent && 'fb_name' in fbEvent;
  }
}
