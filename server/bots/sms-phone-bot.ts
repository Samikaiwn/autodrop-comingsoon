import OpenAI from "openai";
import twilio from "twilio";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Twilio client if credentials are available
let twilioClient: twilio.Twilio | null = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

interface SMSInquiry {
  from: string;
  body: string;
  timestamp?: Date;
}

interface SMSResponse {
  message: string;
  language: string;
  category: string;
}

const supportedLanguages = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 
  'ar', 'hi', 'th', 'vi', 'nl', 'pl', 'tr', 'sv', 'no', 'da'
];

export async function processSMSInquiry(inquiry: SMSInquiry): Promise<SMSResponse> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a multilingual AI customer service agent for AutoDrop Platform.
          
          Guidelines:
          - Detect the customer's language and respond in the same language
          - Keep SMS responses concise (under 160 characters when possible)
          - Be helpful and professional
          - For complex issues, offer to transfer to human support
          - Handle common inquiries: orders, shipping, products, returns
          
          Supported languages: ${supportedLanguages.join(', ')}
          
          Respond in JSON: {
            "message": "Concise helpful response in detected language",
            "language": "detected language code (en, es, fr, etc.)",
            "category": "inquiry type (order, product, shipping, support, etc.)"
          }`
        },
        {
          role: "user",
          content: `SMS from ${inquiry.from}: ${inquiry.body}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Send SMS reply if Twilio is configured
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: result.message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: inquiry.from
        });
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }

    return {
      message: result.message || "Thank you for contacting AutoDrop Platform. We'll assist you shortly.",
      language: result.language || "en",
      category: result.category || "general"
    };

  } catch (error) {
    console.error('SMS bot error:', error);
    return {
      message: "Thank you for your message. Our team will respond soon.",
      language: "en",
      category: "general"
    };
  }
}

export async function handlePhoneCall(callerId: string, callTranscript?: string): Promise<any> {
  try {
    if (!callTranscript) {
      return {
        message: "Hello! Thank you for calling AutoDrop Platform. How can I help you today?",
        language: "en",
        action: "greeting"
      };
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional phone support agent for AutoDrop Platform.
          
          Generate appropriate voice responses for phone calls:
          - Detect language and respond accordingly
          - Be conversational and helpful
          - For complex issues, offer callback or transfer options
          - Keep responses natural for text-to-speech
          
          Return JSON: {
            "message": "Natural spoken response",
            "language": "detected language",
            "action": "continue|transfer|callback|resolve",
            "category": "call type"
          }`
        },
        {
          role: "user",
          content: `Phone call from ${callerId}. Customer said: "${callTranscript}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');

  } catch (error) {
    console.error('Phone bot error:', error);
    return {
      message: "I apologize, but I'm having technical difficulties. Please try calling back in a moment or visit our website.",
      language: "en",
      action: "callback"
    };
  }
}

export function getPhoneNumber(): string | null {
  return process.env.TWILIO_PHONE_NUMBER || null;
}

export function isTwilioConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && 
           process.env.TWILIO_AUTH_TOKEN && 
           process.env.TWILIO_PHONE_NUMBER);
}