import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { INodemailerConfig } from '../config/configuration';
import { NodemailerDto } from './nodemailer.dto';

@Injectable()
export class NodemailerService {
  private readonly logger: Logger = new Logger(NodemailerService.name);
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<INodemailerConfig>('nodemailer').host,
      port: configService.get<INodemailerConfig>('nodemailer').port,
      secure: false,
      auth: {
        user: configService.get<INodemailerConfig>('nodemailer').user,
        pass: configService.get<INodemailerConfig>('nodemailer').password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(data: NodemailerDto) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<INodemailerConfig>('nodemailer').from,
        ...data,
      });
      this.logger.log(`Send nodemailer success!: ${info}`);
    } catch (error) {
      this.logger.log(`Send nodemailer failed!: ${error}`);
    }
  }
}
