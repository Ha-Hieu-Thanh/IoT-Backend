import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DataDocument } from '@app/common/database/mongodb/models/data.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'data',
        schema: DataDocument.schema,
      },
    ]),
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
