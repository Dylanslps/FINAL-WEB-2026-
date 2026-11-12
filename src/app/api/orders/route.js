import { NextResponse } from 'next/server';
import { checkoutOrder, getBuyerOrders, getSellerOrders } from '@/lib/orders';

export async function POST(request) {
  try {
    const body = await request.json();
    const { buyerId, shippingAddress, notes } = body;

    if (!buyerId || !shippingAddress) {
      return NextResponse.json(
        { error: 'ID pembeli dan alamat pengiriman wajib diisi.' },
        { status: 400 }
      );
    }

    const order = await checkoutOrder({
      buyerId: Number(buyerId),
      shippingAddress,
      notes,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get('buyerId');
  const sellerId = searchParams.get('sellerId');

  try {
    if (buyerId) {
      const orders = await getBuyerOrders(Number(buyerId));
      return NextResponse.json({ orders });
    }

    if (sellerId) {
      const orders = await getSellerOrders(Number(sellerId));
      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: 'Parameter buyerId atau sellerId dibutuhkan' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
