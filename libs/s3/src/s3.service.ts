import { Env } from '@app/env';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly env: Env) {
    this.s3Client = new S3Client({
      region: this.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: this.env.AWS_ACCESS_KEY,
        secretAccessKey: this.env.AWS_SECRET_KEY,
      },
    });
  }

  async upload(
    fileName: string,
    fileType: string,
    file: Buffer,
  ): Promise<string> {
    try {
      const res = await new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
      }).done();

      return res.Location;
    } catch (e) {
      throw e;
    }
  }
}
