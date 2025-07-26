export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
                  import.meta.env.VITE_STRIPE_PK || 
                  "",
};

export interface CheckoutData {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: string;
    title: string;
    image?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface CheckoutResponse {
  orderId: string;
  sessionId: string;
  checkoutUrl: string;
}

export async function createCheckoutSession(data: CheckoutData): Promise<CheckoutResponse> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Checkout failed");
  }

  return response.json();
}

export function redirectToCheckout(checkoutUrl: string): void {
  window.location.href = checkoutUrl;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function validateStripeConfig(): boolean {
  return !!stripeConfig.publishableKey;
}
