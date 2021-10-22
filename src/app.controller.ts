import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('*')
  async getSignature(
    @Body() payload,
  ): Promise<any | ForbiddenException | InternalServerErrorException> {
    return this.appService.getSignature(payload);
  }
}
