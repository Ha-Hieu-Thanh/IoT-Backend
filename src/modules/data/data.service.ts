import { DataDocument } from '@app/common/database/mongodb/models/data.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';

@Injectable()
export class DataService {
  constructor(
    @InjectModel('data') private readonly dataModel: Model<DataDocument>,
  ) {}

  async create(data: CreateDataDto): Promise<DataDocument> {
    const createdData = new this.dataModel(data);
    return await createdData.save();
  }
}
