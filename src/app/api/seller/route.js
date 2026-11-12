import { NextResponse } from 'next/server';
import {
  getSellerStore,
  getSellerProducts,
  getSellerIncomingOrders,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  updateSellerStore,
  updateSellerOrderStatus,
} from '@/lib/seller';
import { getCategories } from '@/lib/categories';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId');

  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId diperlukan.' }, { status: 400 });
  }

  try {
    const [store, products, incomingOrders, categories] = await Promise.all([
      getSellerStore(Number(sellerId)),
      getSellerProducts(Number(sellerId)),
      getSellerIncomingOrders(Number(sellerId)),
      getCategories(),
    ]);

    return NextResponse.json({ store, products, incomingOrders, categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, sellerId } = body;

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId wajib disertakan.' }, { status: 400 });
    }

    if (action === 'create_product') {
      const product = await createSellerProduct(Number(sellerId), body);
      return NextResponse.json({ success: true, product }, { status: 201 });
    }

    if (action === 'update_product') {
      const product = await updateSellerProduct(Number(sellerId), body.productId, body);
      return NextResponse.json({ success: true, product });
    }

    if (action === 'update_store') {
      const store = await updateSellerStore(Number(sellerId), body);
      return NextResponse.json({ success: true, store });
    }

    if (action === 'update_order_status') {
      const { orderId, newStatus } = body;
      const order = await updateSellerOrderStatus(Number(sellerId), Number(orderId), newStatus);
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: 'Aksi seller tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId');
  const productId = searchParams.get('productId');

  if (!sellerId || !productId) {
    return NextResponse.json({ error: 'sellerId dan productId wajib diisi.' }, { status: 400 });
  }

  try {
    await deleteSellerProduct(Number(sellerId), Number(productId));
    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
