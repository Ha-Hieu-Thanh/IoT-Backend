import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  // Add your Cloudinary service methods here
  constructor(private readonly configService: ConfigService) {
    // Configure your Cloudinary credentials
    cloudinary.config({
      cloud_name: configService.get('cloudinary').cloud_name,
      api_key: configService.get('cloudinary').api_key,
      api_secret: configService.get('cloudinary').api_secret,
    });
  }

  async uploadFile(dataFile, fileName) {
    // Convert the CSV data to a Buffer
    let dataBuffer = Buffer.from(dataFile, 'utf-8');

    // Upload the buffer to Cloudinary
    try {
      let result = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { resource_type: 'raw', public_id: fileName },
          function (error, result) {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(dataBuffer);
      });

      return (result as any).url; // Return the URL of the uploaded file
    } catch (error) {
      console.error('Upload error: ', error);
    }
  }
}
