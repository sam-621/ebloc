import { PageLayout } from '@/lib/components';

import { OrderTable } from '../components/orders-table';

export const OrderPages = () => {
  return (
    <PageLayout title="Orders" subtitle="Manage your orders">
      <OrderTable />
    </PageLayout>
  );
};
