import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_PORT') === 465,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('MAIL_FROM'),
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendNotificationEmail(
    to: string,
    subject: string,
    message: string,
    linkUrl?: string,
  ): Promise<boolean> {
    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">${subject}</h2>
        <p style="color: #555; line-height: 1.5;">${message}</p>
    `;

    if (linkUrl) {
      html += `
        <p style="margin-top: 20px;">
          <a href="${linkUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">View Details</a>
        </p>
      `;
    }

    html += `
        <p style="margin-top: 30px; font-size: 12px; color: #777;">
          This is an automated message from the Scientific Publishing System. Please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      html,
      text: `${subject}\n\n${message}${linkUrl ? `\n\nView details: ${linkUrl}` : ''}`,
    });
  }
}