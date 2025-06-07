import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AbilitiesInterceptor } from './casl/abilities.interceptor';
import { CaslAbilityFactory } from './casl/casl-ability.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);

  app.useGlobalInterceptors(new AbilitiesInterceptor(app.get(CaslAbilityFactory)));

}
bootstrap();
