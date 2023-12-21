import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  getUserSubcribeToLocation(id: number) {
    throw new Error('Method not implemented.');
    return [];
  }
  deleteLocation(id: number) {
    throw new Error('Method not implemented.');
  }
  updateLocation(id: number, body: UpdateLocationDto) {
    throw new Error('Method not implemented.');
  }
  createLocation(body: CreateLocationDto) {
    throw new Error('Method not implemented.');
  }
  getLocations() {
    throw new Error('Method not implemented.');
  }
}
