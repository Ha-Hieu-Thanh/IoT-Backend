import { Injectable } from '@nestjs/common';
import { ses } from '../client';
import { ConfigService } from '@nestjs/config';
import { IAWSConfig } from '@app/common/config/configuration';

@Injectable()
export class SesService {
  constructor(private readonly configService: ConfigService) {}
  async sendMail(toAddresses: string[], subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Body: {
          Html: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: this.configService.get<IAWSConfig>('aws').sender,
    };
    try {
      const result = await ses.sendEmail(params).promise();
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
