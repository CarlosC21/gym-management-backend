import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Global Validation (DTO enforcement)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable Global Error Formatting
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Use the env port or default to 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
