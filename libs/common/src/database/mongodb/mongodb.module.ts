import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IMongoConfig } from '@app/common/config/configuration';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<IMongoConfig>('mongo').username;
        const password = configService.get<IMongoConfig>('mongo').password;
        const cluster = configService.get<IMongoConfig>('mongo').cluster;
        const database = configService.get<IMongoConfig>('mongo').database;
        console.log(username, password, cluster, database);
        return {
          uri: `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`,
        };
      },
    }),
  ],
})
export class MongodbModule {}
