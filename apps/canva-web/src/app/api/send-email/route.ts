import nodemailer from 'nodemailer';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // Check for API key authentication
  const apiKey = req.headers.get('x-api-key');
  const expectedApiKey = process.env.EMAIL_API_KEY;

  if (!expectedApiKey || apiKey !== expectedApiKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { to, subject, text, html, from, replyTo, cc, bcc, attachments } = await req.json();

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to and subject are required' },
        { status: 400 }
      );
    }

    // Create transporter with SMTP configuration
    const smtpConfig: any = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      tls: {
        rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
        minVersion: 'TLSv1.2',
      },
    };

    // Configure authentication - OAuth2 takes precedence if available
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      // OAuth2 support (for Gmail OAuth)
      smtpConfig.auth = {
        type: 'OAuth2',
        user:  process.env.SMTP_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      };
    } else {
      // Standard username/password authentication
      smtpConfig.auth = {
        user:  process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      };
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    // Prepare email options
    const mailOptions: any = {
      from: from || process.env.FROM_EMAIL,
      to,
      subject,
      text: text || html,
      html: html || text,
    };

    // Add optional fields
    if (replyTo) mailOptions.replyTo = replyTo;
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (attachments) mailOptions.attachments = attachments;

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

