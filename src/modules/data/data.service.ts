import { DataDocument } from '@app/common/database/mongodb/models/data.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';
import { GetDataDto } from './dto/get-data.dto';

@Injectable()
export class DataService {
  constructor(
    @InjectModel('data') private readonly dataModel: Model<DataDocument>,
  ) {}

  async create(data: CreateDataDto): Promise<DataDocument> {
    const createdData = new this.dataModel(data);
    return await createdData.save();
  }

  async getData(query: GetDataDto): Promise<DataDocument[]> {
    const { fromDate, toDate } = query;
    const data = await this.dataModel.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    });
    return data;
  }
}
