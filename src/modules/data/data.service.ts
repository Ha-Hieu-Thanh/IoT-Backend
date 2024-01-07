import { DataDocument } from '@app/common/database/mongodb/models/data.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';
import { GetDataDto } from './dto/get-data.dto';
import { CloudinaryService } from '@app/common/cloudinary/cloudinary.service';
import { calculateAvgAQI } from '@app/common/helper/utils';

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

  async getAqi(query: GetDataDto) {
    const data = await this.getData(query);
    console.log('---', { data });
    const avgAqi = calculateAvgAQI(data);
    return avgAqi;
  }

  async getAqiHistoryInNearly5HoursAndSeparateEachHour(locationId: number) {
    const currentTime = new Date();
    const data = await this.dataModel.find({
      locationId,
      createdAt: {
        $gte: new Date(currentTime.getTime() - 5 * 60 * 60 * 1000),
      },
    });
    const result = [];
    for (let i = 0; i < 5; i++) {
      const startTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        currentTime.getHours() - (i + 1),
        0,
        0,
      );
      const endTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        currentTime.getHours() - i,
        0,
        0,
      );
      const dataInHour = data.filter(
        (item) =>
          item.createdAt.getTime() >= startTime.getTime() &&
          item.createdAt.getTime() < endTime.getTime(),
      );
      const avgAqi = calculateAvgAQI(dataInHour);
      const endTimeInLocal = new Date(endTime);
      endTimeInLocal.setHours(endTimeInLocal.getHours() + 7);

      result.push({
        avgAqi,
        endTime: endTimeInLocal.toISOString(),
      });
    }

    return result;
  }

  async getData(query: GetDataDto): Promise<DataDocument[]> {
    const { fromDate, toDate, exportCsv, locationId } = query;
    const filter: any = {};
    if (fromDate) filter.createdAt = { $gte: new Date(fromDate) };
    if (toDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(toDate) };
    if (locationId) filter.locationId = locationId;
    if (!exportCsv) {
      const data = await this.dataModel
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(10);
      return data;
    }
    const data = await this.dataModel.find(filter);
    const fields = [
      'locationId',
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
