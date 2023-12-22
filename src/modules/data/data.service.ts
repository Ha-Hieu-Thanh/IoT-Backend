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
    // check if exsist from date and to date
    if (fromDate && toDate) {
      return await this.dataModel.find({
        createdAt: { $gte: fromDate, $lte: toDate },
      });
    }
    // check if exsist from date
    if (fromDate) {
      return await this.dataModel.find({
        createdAt: { $gte: fromDate },
      });
    }
    // check if exsist to date
    if (toDate) {
      return await this.dataModel.find({
        createdAt: { $lte: toDate },
      });
    }
    // if not exist from date and to date
    return await this.dataModel.find();
  }
}
