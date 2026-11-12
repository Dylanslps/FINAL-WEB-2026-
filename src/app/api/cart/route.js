import { NextResponse } from 'next/server';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '@/lib/cart';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const buyerId = Number(searchParams.get('buyerId'));

  if (!buyerId) {
    return NextResponse.json({ items: [], totalAmount: 0, totalItems: 0 });
  }

  try {
    const cart = await getCart(buyerId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { buyerId, productId, quantity, selectedVariant, selectedColor } = body;

    if (!buyerId || !productId) {
      return NextResponse.json({ error: 'buyerId dan productId wajib diisi' }, { status: 400 });
    }

    const item = await addToCart({
      buyerId: Number(buyerId),
      productId: Number(productId),
      quantity: Number(quantity) || 1,
      selectedVariant: selectedVariant || null,
      selectedColor: selectedColor || null,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { cartItemId, buyerId, quantity } = body;

    const updated = await updateCartQuantity(Number(cartItemId), Number(buyerId), Number(quantity));
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get('cartItemId');
  const buyerId = searchParams.get('buyerId');
  const action = searchParams.get('action');

  try {
    if (action === 'clear' && buyerId) {
      await clearCart(Number(buyerId));
      return NextResponse.json({ success: true, message: 'Keranjang berhasil dikosongkan' });
    }

    if (cartItemId && buyerId) {
      await removeFromCart(Number(cartItemId), Number(buyerId));
      return NextResponse.json({ success: true, message: 'Item dihapus dari keranjang' });
    }

    return NextResponse.json({ error: 'Parameter tidak lengkap' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
