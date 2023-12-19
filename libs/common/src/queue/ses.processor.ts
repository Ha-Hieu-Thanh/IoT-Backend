import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { SesService } from '../aws/ses/ses.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';

@Injectable()
@Processor('SESQueue')
export class SESQueue {
  constructor(
    private readonly sesService: SesService,
    private readonly nodemailerService: NodemailerService,
  ) {}
  @Process('SendOTP')
  async sendOTP(job: Job<any>) {
    console.log('SESQueue: SendOTP');
    const { to, subject, body } = job.data;
    // return await this.sesService.sendMail(to, subject, body);
    return await this.nodemailerService.sendMail({ to, subject, html: body });
  }
}
