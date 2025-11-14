import nodemailer from 'nodemailer';

interface EmailDetails {
  senderEmail: string;
  recipientEmail: string;
  senderLocation: string;
  recipientLocation: string;
  transportMode: string;
  deliveryTime: string;
  distance: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter using environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send a SnailMail delivery notification
   */
  async sendDeliveryEmail(details: EmailDetails): Promise<void> {
    const {
      senderEmail,
      recipientEmail,
      senderLocation,
      recipientLocation,
      transportMode,
      deliveryTime,
      distance,
    } = details;

    // Format transport mode for display
    const formattedTransport = transportMode
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create email content
    const subject = `📬 SnailMail: Your message is on its way! (${deliveryTime})`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Press Start 2P', monospace, Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border: 4px solid #333;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 8px 8px 0px #333;
          }
          .header {
            text-align: center;
            color: #ff6b6b;
            margin-bottom: 30px;
          }
          .info-box {
            background-color: #f7f7f7;
            border: 2px solid #333;
            padding: 15px;
            margin: 15px 0;
          }
          .info-row {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .value {
            color: #333;
          }
          .highlight {
            background-color: #ffd93d;
            padding: 2px 5px;
            border: 2px solid #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
          .transport-badge {
            display: inline-block;
            background-color: #4ecdc4;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 SnailMail</h1>
            <p>Your message is on its way!</p>
          </div>

          <div class="info-box">
            <div class="info-row">
              <span class="label">From:</span>
              <span class="value">${senderEmail} (${senderLocation})</span>
            </div>
            <div class="info-row">
              <span class="label">To:</span>
              <span class="value">${recipientEmail} (${recipientLocation})</span>
            </div>
            <div class="info-row">
              <span class="label">Distance:</span>
              <span class="value">${distance}</span>
            </div>
            <div class="info-row">
              <span class="label">Transport Mode:</span>
              <span class="transport-badge">${formattedTransport}</span>
            </div>
            <div class="info-row">
              <span class="label">Estimated Delivery Time:</span>
              <span class="highlight">${deliveryTime}</span>
            </div>
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <strong>Your message will arrive via ${formattedTransport.toLowerCase()}!</strong>
          </p>

          <p style="text-align: center; color: #888; font-size: 14px;">
            Because sometimes, anticipation is better than instant gratification.
          </p>

          <div class="footer">
            <p>This is an automated message from SnailMail</p>
            <p>The world's most hilariously useless email service 🐌</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
📬 SnailMail - Your message is on its way!

From: ${senderEmail} (${senderLocation})
To: ${recipientEmail} (${recipientLocation})
Distance: ${distance}
Transport Mode: ${formattedTransport}
Estimated Delivery Time: ${deliveryTime}

Your message will arrive via ${formattedTransport.toLowerCase()}!

Because sometimes, anticipation is better than instant gratification.

---
This is an automated message from SnailMail
The world's most hilariously useless email service 🐌
    `.trim();

    // Send email to both sender and recipient
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SnailMail <noreply@snailmail.com>',
      to: recipientEmail,
      cc: senderEmail,
      subject,
      text: textContent,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
