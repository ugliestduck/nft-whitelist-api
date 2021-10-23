import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/whitelist')
  async getWhitelist(): Promise<any | InternalServerErrorException> {
    return this.appService.getWhitelist();
  }

  @Post('*')
  async getSignature(
    @Body() payload,
  ): Promise<any | ForbiddenException | InternalServerErrorException> {
    return this.appService.getSignature(payload);
  }
}
