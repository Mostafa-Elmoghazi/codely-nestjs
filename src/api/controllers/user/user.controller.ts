import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Mediator } from 'codely/codely.business/common';

@Controller('users')
export class UserController extends BaseController {
  constructor(private mediator: Mediator) {
    super();
  }
}
