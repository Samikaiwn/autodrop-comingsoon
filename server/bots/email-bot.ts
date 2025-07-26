import OpenAI from "openai";
import { MailService } from '@sendgrid/mail';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const mailService = new MailService();

// Only initialize SendGrid if API key is properly configured
const sendgridApiKey = process.env.SENDGRID_API_KEY;
let isSendGridConfigured = false;

if (sendgridApiKey) {
  if (sendgridApiKey.startsWith('SG.')) {
    try {
      mailService.setApiKey(sendgridApiKey);
      isSendGridConfigured = true;
      console.log('✅ SendGrid configured successfully');
    } catch (error) {
      console.warn('⚠️ SendGrid API key provided but failed to initialize. Email features disabled.');
    }
  } else {
    console.warn('⚠️ SendGrid API key provided but invalid format. API keys must start with "SG.". Email features disabled.');
  }
} else {
  console.log('ℹ️ SendGrid API key not configured. Email features disabled.');
}

interface EmailInquiry {
  from: string;
  subject: string;
  body: string;
}

interface EmailResponse {
  subject: string;
  body: string;
  language: string;
  category: string;
}

export async function processEmailInquiry(inquiry: EmailInquiry): Promise<EmailResponse> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional customer service agent for AutoDrop Platform, an e-commerce store. 
          
          Respond to customer inquiries professionally and helpfully. Categorize the inquiry and detect the language.
          
          Common inquiry types:
          - order_status: Questions about order tracking, delivery
          - product_info: Questions about products, specifications, availability
          - returns: Return requests, exchanges, refunds
          - shipping: Shipping costs, delivery times, locations
          - technical: Website issues, account problems
          - general: Other inquiries
          
          Respond in JSON format: {
            "subject": "Reply subject line",
            "body": "Professional email response",
            "language": "detected language (en, es, fr, de, etc.)",
            "category": "inquiry category"
          }`
        },
        {
          role: "user",
          content: `Customer Email:
          From: ${inquiry.from}
          Subject: ${inquiry.subject}
          Body: ${inquiry.body}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Send automated reply if SendGrid is configured
    if (isSendGridConfigured) {
      try {
        await mailService.send({
          to: inquiry.from,
          from: 'support@autodropplatform.shop',
          subject: `Re: ${inquiry.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
                <h1>AutoDrop Platform</h1>
                <p>Customer Support Response</p>
              </div>
              <div style="padding: 20px; background: #f8fafc;">
                ${result.body.replace(/\n/g, '<br>')}
              </div>
              <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
                <p>This is an automated response from our AI customer service bot.</p>
                <p>For urgent matters, please call our support line.</p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return {
      subject: result.subject || `Re: ${inquiry.subject}`,
      body: result.body || "Thank you for contacting us. We'll get back to you soon.",
      language: result.language || "en",
      category: result.category || "general"
    };

  } catch (error) {
    console.error('Email bot error:', error);
    return {
      subject: `Re: ${inquiry.subject}`,
      body: "Thank you for your message. Our team will respond within 24 hours.",
      language: "en",
      category: "general"
    };
  }
}

export async function generateEmailCampaign(type: string): Promise<any> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate professional email marketing campaigns for AutoDrop Platform e-commerce store.
          
          Campaign types:
          - welcome: Welcome new customers
          - abandoned_cart: Recover abandoned shopping carts
          - promotion: Promotional offers and sales
          - newsletter: Weekly product highlights
          
          Return JSON format: {
            "subject": "Engaging subject line",
            "preheader": "Preview text",
            "textContent": "Plain text version",
            "htmlContent": "HTML email template",
            "targetAudience": "Target customer segment"
          }`
        },
        {
          role: "user",
          content: `Create a ${type} email campaign for our e-commerce platform.`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Email campaign generation error:', error);
    throw error;
  }
}