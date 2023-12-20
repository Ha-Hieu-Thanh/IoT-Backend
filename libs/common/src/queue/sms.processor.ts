import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ITwilioSendOtp, TwilioService } from '../twilio/twilio.service';
import { Job } from 'bull';

@Injectable()
@Processor('SMSQueue')
export class SMSQueue {
  constructor(private readonly twilioService: TwilioService) {}
  @Process('SendOTP')
  async sendOTP(job: Job<any>) {
    const { phone, body } = job.data as ITwilioSendOtp;
    console.log('---SMSQUEUE---SendOTP', phone, body);
    return await this.twilioService.sendOTP({ phone, body });
  }
}
