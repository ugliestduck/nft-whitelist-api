import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import configuration from './configuration';
import helmet from 'helmet';

async function bootstrap() {
  const config = configuration();

  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.use(helmet());
  app.enableCors();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(config.port || 3000);
}
bootstrap();
