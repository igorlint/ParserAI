import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: true, credentials: true } });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
import { AppModule } from './app.module';

async function bootstrap() {
  // Enable CORS for frontend integration
  const app = await NestFactory.create(AppModule, { cors: { origin: true, credentials: true } });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  return;
}

// If not replaced above, fallback
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
