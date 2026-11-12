import { NextResponse } from 'next/server';
import { createReview, getProductReviews } from '@/lib/reviews';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, productId, buyerId, rating, comment } = body;

    if (!orderId || !productId || !buyerId || !rating) {
      return NextResponse.json(
        { error: 'orderId, productId, buyerId, dan rating wajib diisi.' },
        { status: 400 }
      );
    }

    const review = await createReview({
      orderId: Number(orderId),
      productId: Number(productId),
      buyerId: Number(buyerId),
      rating: Number(rating),
      comment: comment || '',
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'productId wajib diisi.' }, { status: 400 });
  }

  try {
    const reviews = await getProductReviews(Number(productId));
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
