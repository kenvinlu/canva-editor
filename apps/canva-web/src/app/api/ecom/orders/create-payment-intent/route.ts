import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products, email } = body;
    
    if (!products || !email) {
      return NextResponse.json(
        { error: 'Products and email are required' },
        { status: 400 }
      );
    }
    
    const result = await doRequest(products, email);
    return Response.json(result);
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(products: string[], email: string): Promise<any> {
  return $post('/orders/create-payment-intent', { products, email });
}
