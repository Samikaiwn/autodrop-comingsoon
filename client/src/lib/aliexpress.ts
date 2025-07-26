export const aliexpressConfig = {
  appKey: import.meta.env.VITE_ALIEXPRESS_APP_KEY || 
          import.meta.env.VITE_ALIEXPRESS_API_KEY || 
          "517196",
  callbackUrl: import.meta.env.VITE_ALIEXPRESS_CALLBACK_URL || 
               "https://autodropplatform.shop/api/call1",
};

export interface AliExpressProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  rating?: string;
  ratingCount?: number;
  categoryId?: string;
  inStock: boolean;
}

export interface ImportProductRequest {
  productUrl?: string;
  aliexpressId?: string;
}

export interface ImportProductResponse {
  success: boolean;
  product?: AliExpressProduct;
  message?: string;
}

export async function importProductFromAliExpress(request: ImportProductRequest): Promise<ImportProductResponse> {
  try {
    const response = await fetch("/api/aliexpress/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to import product",
      };
    }

    const product = await response.json();
    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("AliExpress import error:", error);
    return {
      success: false,
      message: "Network error occurred while importing product",
    };
  }
}

export function extractProductIdFromUrl(url: string): string | null {
  try {
    // AliExpress product URLs typically contain the product ID
    // Example: https://www.aliexpress.com/item/1005001234567890.html
    const match = url.match(/\/item\/(\d+)\.html/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting product ID from URL:", error);
    return null;
  }
}

export function validateAliExpressUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes("aliexpress.com");
  } catch (error) {
    return false;
  }
}

export function validateAliExpressConfig(): boolean {
  return !!(aliexpressConfig.appKey && aliexpressConfig.callbackUrl);
}

export function buildAliExpressApiUrl(endpoint: string, params: Record<string, string> = {}): string {
  const baseUrl = "https://gw.api.alibaba.com/openapi";
  const searchParams = new URLSearchParams({
    app_key: aliexpressConfig.appKey,
    ...params,
  });
  
  return `${baseUrl}${endpoint}?${searchParams.toString()}`;
}
