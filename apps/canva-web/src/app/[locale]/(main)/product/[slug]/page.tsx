import { fetchProductBySlug } from '@canva-web/src/services/payment.service';
import { notFound } from 'next/navigation';
import ProductPageClient from './client';
import { Product } from '@canva-web/src/models/product.model';
interface PaymentPageParams {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PaymentPageParams) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  try {
    const product = await fetchProductBySlug(slug).then(res => {
      if (res.data && Array.isArray(res.data)) {
        res.data = res.data[0];
      }
      return res;
    });

    if (!product?.data) {
      throw new Error('Product not found');
    }
    
    return <ProductPageClient product={product?.data as Product} productId={slug} />;
  } catch (err) {
    console.log(err);
    return notFound();
  }
}