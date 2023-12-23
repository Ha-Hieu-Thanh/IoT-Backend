import { DataDocument } from '@app/common/database/mongodb/models/data.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';
import { GetDataDto } from './dto/get-data.dto';
import { CloudinaryService } from '@app/common/cloudinary/cloudinary.service';

@Injectable()
export class DataService {
  constructor(
    @InjectModel('data') private readonly dataModel: Model<DataDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(data: CreateDataDto): Promise<DataDocument> {
    const createdData = new this.dataModel(data);
    return await createdData.save();
  }

  async getData(query: GetDataDto): Promise<DataDocument[]> {
    const { fromDate, toDate, exportCsv, locationId } = query;
    const filter: any = {};
    if (fromDate) filter.createdAt = { $gte: new Date(fromDate) };
    if (toDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(toDate) };
    if (locationId) filter.locationId = locationId;
    const data = await this.dataModel.find(filter);
    if (!exportCsv) return data;

    const fields = [
      'humidity',
      'temperature',
      'CO_concentration',
      'CO2_concentration',
      'NH3_concentration',
      'PM25_concentration',
      'createdAt',
    ];
    const replacer = (key, value) => (value === null ? '' : value);
    const csv = data.map((row) =>
      fields
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(','),
    );
    // transform array csv to string each row separate by \n
    csv.unshift(fields.join(','));
    const csvString = csv.join('\r\n');
    const csvStringCsv = await this.cloudinaryService.uploadFile(
      csvString,
      'test.csv',
    );
    return csvStringCsv;
  }
}
