import { NextResponse } from 'next/server';
import {
  getAdminStats,
  getAdminUsers,
  getPendingSellers,
  approveSeller,
  rejectSeller,
  deleteUser,
  deleteInfringingProduct,
} from '@/lib/admin';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/categories';
import { getProducts } from '@/lib/products';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const adminId = searchParams.get('adminId');

  if (!adminId) {
    return NextResponse.json({ error: 'adminId diperlukan.' }, { status: 400 });
  }

  try {
    const [stats, pendingSellers, users, categories, productsResult] = await Promise.all([
      getAdminStats(),
      getPendingSellers(),
      getAdminUsers(),
      getCategories(),
      getProducts({ limit: 100 }),
    ]);

    return NextResponse.json({
      stats,
      pendingSellers: pendingSellers || [],
      users: users || [],
      categories: categories || [],
      products: productsResult?.products || [],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: 'adminId wajib disertakan.' }, { status: 400 });
    }

    if (action === 'approve_seller') {
      const { sellerId } = body;
      const res = await approveSeller(Number(sellerId));
      return NextResponse.json({ success: true, seller: res });
    }

    if (action === 'reject_seller') {
      const { sellerId } = body;
      const res = await rejectSeller(Number(sellerId));
      return NextResponse.json({ success: true, seller: res });
    }

    if (action === 'delete_user') {
      const { targetUserId } = body;
      const res = await deleteUser(Number(adminId), Number(targetUserId));
      return NextResponse.json({ success: true, user: res });
    }

    if (action === 'delete_product') {
      const { productId } = body;
      const res = await deleteInfringingProduct(Number(productId));
      return NextResponse.json({ success: true, product: res });
    }

    if (action === 'create_category') {
      const { name, slug, description, image_url } = body;
      const res = await createCategory({ name, slug, description, image_url });
      return NextResponse.json({ success: true, category: res }, { status: 201 });
    }

    if (action === 'update_category') {
      const { id, name, slug, description, image_url } = body;
      const res = await updateCategory(Number(id), { name, slug, description, image_url });
      return NextResponse.json({ success: true, category: res });
    }

    if (action === 'delete_category') {
      const { id } = body;
      const res = await deleteCategory(Number(id));
      return NextResponse.json({ success: true, category: res });
    }

    return NextResponse.json({ error: 'Aksi admin tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
