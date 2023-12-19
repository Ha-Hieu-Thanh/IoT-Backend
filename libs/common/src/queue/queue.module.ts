import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SMSQueue } from './sms.processor';
import { SESQueue } from './ses.processor';
import { TwilioModule } from '../twilio/twilio.module';
import { SesModule } from '../aws/ses/ses.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';

@Module({
  imports: [
    // BullModule.registerQueue({
    //   name: 'SMSQueue',
    // }),
    // SES
    BullModule.registerQueue({
      name: 'SESQueue',
    }),
    // TwilioModule,
    SesModule,
    NodemailerModule,
    // Add more queues as needed
  ],
  providers: [
    // SMSQueue,
    SESQueue,
  ],
  exports: [
    // SMSQueue,
    SESQueue,
  ],
})
export class QueueModule {}
