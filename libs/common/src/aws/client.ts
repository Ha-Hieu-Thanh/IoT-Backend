import { SES, S3, config } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import configuration, { IAWSConfig } from '../config/configuration';
import { ConfigService } from '@nestjs/config';

const { accessKeyId, region, secretAccessKey } = configuration().aws;

// Use the config object as needed
const credentials: CredentialsOptions = {
  accessKeyId,
  secretAccessKey,
};

config.update({
  credentials: credentials,
  region: region,
});

// export const s3 = new S3({
//   signatureVersion: 'v4',
// });

export const ses = new SES({
  signatureVersion: 'v4',
});
