import OpenAI from "openai";
import { type Product as DbProduct } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AdContent {
  headline: string;
  description: string;
  callToAction: string;
  targetAudience: string;
  platform: string;
  keywords?: string[];
}

interface PageDecorations {
  bannerText: string;
  heroSection: {
    headline: string;
    subtitle: string;
    ctaText: string;
  };
  promotionalBadges: string[];
  urgencyMessages: string[];
}

export async function generateProductAd(product: DbProduct, platform: string): Promise<AdContent> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional marketing copywriter specializing in e-commerce advertising.
          
          Create compelling ads for different platforms:
          - facebook: Engaging, emotional, visual-focused
          - google: Search-focused, benefit-driven, keyword-rich
          - instagram: Visual-first, lifestyle-oriented, hashtag-friendly
          - twitter: Concise, trending, conversational
          - email: Personal, value-focused, action-oriented
          
          Return JSON: {
            "headline": "Attention-grabbing headline (max 50 chars for most platforms)",
            "description": "Compelling product description with benefits",
            "callToAction": "Strong CTA button text",
            "targetAudience": "Primary target demographic",
            "keywords": ["relevant", "keywords", "for", "targeting"]
          }`
        },
        {
          role: "user",
          content: `Create a ${platform} ad for this product:
          
          Title: ${product.title}
          Description: ${product.description || 'No description available'}
          Price: $${product.price}
          Category: General`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      headline: result.headline || product.title,
      description: result.description || product.description || 'Great product for you',
      callToAction: result.callToAction || "Shop Now", 
      targetAudience: result.targetAudience || "General shoppers",
      platform: platform,
      keywords: result.keywords || []
    };

  } catch (error) {
    console.error('Ad generation error:', error);
    return {
      headline: product.title,
      description: product.description || 'Great product for you',
      callToAction: "Shop Now",
      targetAudience: "General shoppers",
      platform: platform,
      keywords: []
    };
  }
}

export async function generatePageDecorations(theme: string): Promise<PageDecorations> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate compelling page decorations and promotional content for AutoDrop Platform.
          
          Themes:
          - modern: Clean, minimalist, tech-focused
          - seasonal: Holiday and seasonal promotions
          - urgent: Sales, limited time offers, scarcity
          - luxury: Premium, high-end, exclusive
          - tech-focused: Innovation, cutting-edge, gadgets
          
          Return JSON: {
            "bannerText": "Eye-catching banner message",
            "heroSection": {
              "headline": "Main hero headline",
              "subtitle": "Supporting subtitle",
              "ctaText": "Call-to-action button text"
            },
            "promotionalBadges": ["badge1", "badge2", "badge3"],
            "urgencyMessages": ["message1", "message2"]
          }`
        },
        {
          role: "user",
          content: `Create ${theme} themed decorations for our e-commerce platform AutoDrop Platform.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      bannerText: result.bannerText || "Welcome to AutoDrop Platform",
      heroSection: {
        headline: result.heroSection?.headline || "Discover Amazing Products",
        subtitle: result.heroSection?.subtitle || "Quality items at unbeatable prices",
        ctaText: result.heroSection?.ctaText || "Shop Now"
      },
      promotionalBadges: result.promotionalBadges || ["Free Shipping", "24/7 Support", "Easy Returns"],
      urgencyMessages: result.urgencyMessages || ["Limited Time Offer", "While Supplies Last"]
    };

  } catch (error) {
    console.error('Page decoration generation error:', error);
    return {
      bannerText: "Welcome to AutoDrop Platform",
      heroSection: {
        headline: "Discover Amazing Products",
        subtitle: "Quality items at unbeatable prices",
        ctaText: "Shop Now"
      },
      promotionalBadges: ["Free Shipping", "24/7 Support", "Easy Returns"],
      urgencyMessages: ["Limited Time Offer", "While Supplies Last"]
    };
  }
}

export async function generateSocialMediaContent(productId: string, platform: string): Promise<any> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Create engaging social media content for e-commerce products.
          
          Platform-specific guidelines:
          - instagram: Visual storytelling, hashtags, lifestyle focus
          - facebook: Community engagement, shareability, emotional connection
          - twitter: Concise, trendy, conversation-starter
          - tiktok: Entertaining, viral potential, youth-focused
          - pinterest: Inspirational, aesthetic, save-worthy
          
          Return JSON: {
            "caption": "Engaging post caption",
            "hashtags": ["#relevant", "#hashtags"],
            "visualDescription": "Description of ideal accompanying image/video",
            "postingTips": "Best practices for this platform"
          }`
        },
        {
          role: "user",
          content: `Create ${platform} content for product ID: ${productId}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');

  } catch (error) {
    console.error('Social media content generation error:', error);
    throw error;
  }
}