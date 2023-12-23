import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DataDocument } from '@app/common/database/mongodb/models/data.model';
import { CloudinaryModule } from '@app/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: 'data',
        schema: DataDocument.schema,
      },
    ]),
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
