import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@app/common/core/filter/exception.filter';
import { RedisSocketIoAdapter } from '@app/common/socket/socket.adapter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Air Quatily IOT - API')
    .setDescription('Dev by Thanh')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  const mqttMicroservice = app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: `wss://${process.env.MQTT_HOST}:${+process.env.MQTT_PORT}/mqtt`,
      clientId: process.env.MQTT_CLIENT_ID,
    },
  });
  console.log(`mqtt://${process.env.MQTT_HOST}:${+process.env.MQTT_PORT}`);
  await app.startAllMicroservices();
  console.log('Microservice is listening');
  const redisIoAdapter = new RedisSocketIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const whitelist = '*';
  const corsOptions: CorsOptions = {
    origin: whitelist,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Language',
      'Access-Control-Allow-Origin',
      'Accept-Language',
      'X-Timezone',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  };
  app.enableCors(corsOptions);

  app.useLogger(app.get(Logger));
  await app.listen(+process.env.PORT || 3000, () => {
    // log
    app
      .get(Logger)
      .log(
        `--------Server is listening on port ${
          +process.env.PORT || 3000
        }----------`,
      );
  });
}
bootstrap();
