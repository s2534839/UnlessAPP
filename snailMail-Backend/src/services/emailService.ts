import nodemailer from 'nodemailer';

export interface EmailJob {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  transportMode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';
  deliveryTimeSeconds: number;
  startTime: number;
  status: 'pending' | 'in-transit' | 'delivered' | 'failed';
  progress: number; // 0-100
}

// In-memory storage for email jobs
const emailJobs = new Map<string, EmailJob>();

/**
 * Create email transporter
 * Uses Gmail SMTP for demo purposes
 * In production, use a proper email service like SendGrid, AWS SES, etc.
 */
function createTransporter() {
  // For development/demo, we'll use a test account from Ethereal
  // In production, configure with real SMTP credentials
  const testAccount = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (testAccount) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback to console logging for demo
  console.warn('⚠️ Email credentials not configured. Emails will be logged to console only.');
  return null;
}

/**
 * Generate unique job ID
 */
function generateJobId(): string {
  return `email_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Schedule an email for delayed delivery
 */
export async function scheduleEmail(
  from: string,
  to: string,
  subject: string,
  message: string,
  transportMode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing',
  deliveryTimeSeconds: number
): Promise<EmailJob> {
  const jobId = generateJobId();

  const job: EmailJob = {
    id: jobId,
    from,
    to,
    subject,
    message,
    transportMode,
    deliveryTimeSeconds,
    startTime: Date.now(),
    status: 'in-transit',
    progress: 0,
  };

  emailJobs.set(jobId, job);

  // Start the delivery process
  deliverEmail(job);

  return job;
}

/**
 * Simulate email delivery over time
 */
async function deliverEmail(job: EmailJob): Promise<void> {
  const transporter = createTransporter();

  // Update progress every second
  const updateInterval = 1000; // 1 second
  const totalTime = job.deliveryTimeSeconds * 1000; // convert to milliseconds

  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - job.startTime;
    const progress = Math.min((elapsed / totalTime) * 100, 100);

    job.progress = progress;
    emailJobs.set(job.id, job);

    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, updateInterval);

  // Wait for the delivery time
  await new Promise((resolve) => setTimeout(resolve, totalTime));

  // Send the actual email
  try {
    if (transporter) {
      await transporter.sendMail({
        from: job.from,
        to: job.to,
        subject: `[SnailMail via ${job.transportMode}] ${job.subject}`,
        text: job.message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">📬 SnailMail Delivery</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <p style="font-size: 14px; color: #666;">
                Delivered via: <strong>${job.transportMode}</strong><br>
                Delivery time: <strong>${formatDeliveryTime(job.deliveryTimeSeconds)}</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                ${job.message.replace(/\n/g, '<br>')}
              </div>
              <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">
                Because sometimes, anticipation is better than instant gratification.
              </p>
            </div>
          </div>
        `,
      });

      job.status = 'delivered';
      console.log(`✅ Email delivered: ${job.id}`);
    } else {
      // Demo mode - just log to console
      console.log('\n📧 ═══════════════════════════════════════════════════════════');
      console.log(`📬 SnailMail Delivery (${job.transportMode})`);
      console.log('═════════════════════════════════════════════════════════════');
      console.log(`From: ${job.from}`);
      console.log(`To: ${job.to}`);
      console.log(`Subject: ${job.subject}`);
      console.log(`Delivery Time: ${formatDeliveryTime(job.deliveryTimeSeconds)}`);
      console.log('─────────────────────────────────────────────────────────────');
      console.log(`Message:\n${job.message}`);
      console.log('═════════════════════════════════════════════════════════════\n');

      job.status = 'delivered';
    }
  } catch (error) {
    console.error('❌ Failed to deliver email:', error);
    job.status = 'failed';
  }

  emailJobs.set(job.id, job);
}

/**
 * Get job status
 */
export function getEmailJob(jobId: string): EmailJob | undefined {
  return emailJobs.get(jobId);
}

/**
 * Get all jobs (for admin purposes)
 */
export function getAllEmailJobs(): EmailJob[] {
  return Array.from(emailJobs.values());
}

/**
 * Format delivery time in human-readable format
 */
function formatDeliveryTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0 && days === 0 && hours === 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 seconds';
}
