import { notFound } from 'next/navigation';
import { getOrderDetail } from '@/lib/orders';
import OrderDetailTracker from '@/components/OrderDetailTracker';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderDetail(Number(id));

  if (!order) {
    notFound();
  }

  return <OrderDetailTracker order={order} />;
}
