import { NextResponse } from 'next/server';
import { loginUser, registerBuyer, registerSeller, deleteRejectedSeller, getUserById } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      const { email, password } = body;
      const user = await loginUser(email, password);
      return NextResponse.json({ success: true, user });
    }

    if (action === 'register_buyer') {
      const { name, email, password, phone, address } = body;
      const user = await registerBuyer({ name, email, password, phone, address });
      return NextResponse.json({ success: true, user }, { status: 201 });
    }

    if (action === 'register_seller') {
      const { name, email, password, phone, address, storeName, storeDescription } = body;
      const user = await registerSeller({
        name,
        email,
        password,
        phone,
        address,
        storeName,
        storeDescription,
      });
      return NextResponse.json({ success: true, user }, { status: 201 });
    }

    if (action === 'delete_rejected') {
      const { userId } = body;
      await deleteRejectedSeller(Number(userId));
      return NextResponse.json({ success: true, message: 'Akun berhasil dihapus.' });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenali.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId diperlukan.' }, { status: 400 });
  }

  try {
    const user = await getUserById(Number(userId));
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
