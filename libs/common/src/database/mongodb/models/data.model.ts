import { Prop, Schema } from '@nestjs/mongoose';
import { DefaultSchemaOptions } from '../base/base.schema-options';
import { BaseDocument } from '../base/base.document';

@Schema(DefaultSchemaOptions)
export class DataDocument extends BaseDocument {
  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  CO_concentration: number;

  @Prop({ required: true })
  CO2_concentration: number;

  @Prop({ required: true })
  NH3_concentration: number;

  @Prop({ required: true })
  PM25_concentration: number;
}
