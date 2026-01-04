import { $nextFetch, $nextPost } from './base-request.service';
import { Product } from '../models/product.model';

async function fetchProductBySlug(slug: string) {
  return $nextFetch<Product | Product[]>(`/ecom/product/${encodeURIComponent(slug)}`);
}

async function createPaymentIntent(products: string[], email: string) {
  return $nextPost<{ clientSecret: string; orderId: string; }>('/orders/create-payment-intent', { products, email });
}

export { createPaymentIntent, fetchProductBySlug };