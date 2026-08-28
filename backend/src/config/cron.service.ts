import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron('*/14 * * * *')
  handlePing() {
    const url = this.configService.get<string>('API_URL');
    if (!url) {
      this.logger.warn('Cron job skipped: API_URL environment variable is not defined.');
      return;
    }

    try {
      const client = url.startsWith('https') ? https : http;
      client
        .get(url, (res) => {
          if (res.statusCode === 200) {
            this.logger.log(`Cron job executed successfully (pinged self): ${url}`);
          } else {
            this.logger.warn(`Cron job ping returned non-200 status code: ${res.statusCode}`);
          }
        })
        .on('error', (err) => {
          this.logger.error(`Error executing cron job (network request failed): ${err.message}`);
        });
    } catch (err) {
      this.logger.error(`Error executing cron job (invalid URL or protocol error): ${err.message}`);
    }
  }
}
