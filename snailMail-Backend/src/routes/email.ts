import { Router, Request, Response } from 'express';
import { scheduleEmail, getEmailJob, getAllEmailJobs, EmailJob } from '../services/emailService.js';

const router = Router();

interface SendEmailRequest {
  from: string;
  to: string;
  subject: string;
  message: string;
  transportMode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';
  deliveryTimeSeconds: number;
  speedMultiplier?: number; // Optional: speed up delivery for demo (e.g., 3600 = 1 hour per second)
}

/**
 * POST /api/email/send
 * Send an email with delayed delivery based on transport mode
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const {
      from,
      to,
      subject,
      message,
      transportMode,
      deliveryTimeSeconds,
      speedMultiplier = 1,
    } = req.body as SendEmailRequest;

    // Validation
    if (!from || !to || !subject || !message || !transportMode || !deliveryTimeSeconds) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, subject, message, transportMode, deliveryTimeSeconds',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from) || !emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format',
      });
    }

    // Validate transport mode
    const validModes = ['walking', 'swimming', 'pigeon', 'rock-climbing'];
    if (!validModes.includes(transportMode)) {
      return res.status(400).json({
        success: false,
        error: `Invalid transport mode. Must be one of: ${validModes.join(', ')}`,
      });
    }

    // Apply speed multiplier for demo purposes
    const actualDeliveryTime = Math.ceil(deliveryTimeSeconds / speedMultiplier);

    // Schedule the email
    const job = await scheduleEmail(
      from,
      to,
      subject,
      message,
      transportMode,
      actualDeliveryTime
    );

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        transportMode: job.transportMode,
        estimatedDeliveryTime: actualDeliveryTime,
        originalDeliveryTime: deliveryTimeSeconds,
        speedMultiplier,
        message: 'Email scheduled for delivery',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
});

/**
 * GET /api/email/status/:jobId
 * Get the status of an email delivery job
 */
router.get('/status/:jobId', (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const job = getEmailJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Email job not found',
      });
    }

    const elapsed = Date.now() - job.startTime;
    const remaining = Math.max(0, job.deliveryTimeSeconds * 1000 - elapsed);

    res.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        transportMode: job.transportMode,
        from: job.from,
        to: job.to,
        elapsedSeconds: Math.floor(elapsed / 1000),
        remainingSeconds: Math.floor(remaining / 1000),
        totalDeliverySeconds: job.deliveryTimeSeconds,
      },
    });
  } catch (error) {
    console.error('Error getting email status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get email status',
    });
  }
});

/**
 * GET /api/email/jobs
 * Get all email jobs (for admin/debugging)
 */
router.get('/jobs', (req: Request, res: Response) => {
  try {
    const jobs = getAllEmailJobs();

    res.json({
      success: true,
      data: {
        total: jobs.length,
        jobs: jobs.map((job) => ({
          id: job.id,
          status: job.status,
          progress: job.progress,
          transportMode: job.transportMode,
          from: job.from,
          to: job.to,
          startTime: new Date(job.startTime).toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error getting email jobs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get email jobs',
    });
  }
});

export default router;
