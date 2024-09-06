import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { Configuration } from '../config/configuration';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: Configuration) {
    const mainConfig = this.configService.mail();
    this.transporter = nodemailer.createTransport({
      host: mainConfig.host,
      port: mainConfig.port,
      ignoreTLS: mainConfig.ignoreTls,
      secure: mainConfig.secure,
      requireTLS: mainConfig.requireTls,
      auth: {
        user: mainConfig.user,
        pass: mainConfig.password,
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    const mainConfig = this.configService.mail();
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${mainConfig.defaultName}" <${mainConfig.defaultEmail}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
