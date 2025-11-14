import { Router, Request, Response } from 'express';
import { emailService } from '../services/emailService';

const router = Router();

interface SendEmailRequest {
  senderEmail: string;
  recipientEmail: string;
  senderLocation: string;
  recipientLocation: string;
  transportMode: string;
  deliveryTime: string;
  distance: string;
}

/**
 * POST /api/email/send
 * Send a delivery notification email
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const {
      senderEmail,
      recipientEmail,
      senderLocation,
      recipientLocation,
      transportMode,
      deliveryTime,
      distance,
    }: SendEmailRequest = req.body;

    // Validate required fields
    if (
      !senderEmail ||
      !recipientEmail ||
      !senderLocation ||
      !recipientLocation ||
      !transportMode ||
      !deliveryTime ||
      !distance
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Send the email
    await emailService.sendDeliveryEmail({
      senderEmail,
      recipientEmail,
      senderLocation,
      recipientLocation,
      transportMode,
      deliveryTime,
      distance,
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please check your email configuration.',
    });
  }
});

/**
 * GET /api/email/health
 * Check email service health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await emailService.verifyConnection();

    res.json({
      success: isHealthy,
      message: isHealthy
        ? 'Email service is configured and ready'
        : 'Email service configuration issue',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service health check failed',
    });
  }
});

export default router;
