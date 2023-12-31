import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { ITwilioConfig } from '../config/configuration';

export interface ITwilioSendOtp {
  phone: string;
  body: string;
}

@Injectable()
export class TwilioService {
  private readonly client;
  constructor(private readonly configService: ConfigService) {
    const { id, token } = this.configService.get<ITwilioConfig>('twilio');
    this.client = twilio(id, token);
  }

  async sendOTP(data: ITwilioSendOtp) {
    try {
      let { phone } = data;
      if (phone.startsWith('0')) phone = '+84' + phone;
      const from = this.configService.get<ITwilioConfig>('twilio').phone;
      const sendSms = await this.client.messages.create({
        body: data.body,
        from,
        to: phone,
      });
      console.log(sendSms);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
