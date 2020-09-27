import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port, function handleAppListening() {
    console.log(`App started on port ${port} in ${process.env.NODE_ENV} env`);
  });
}
bootstrap();
