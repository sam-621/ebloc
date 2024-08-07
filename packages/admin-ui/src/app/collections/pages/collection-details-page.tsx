import { FormProvider } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';

import { LogoLoader, PageLayout } from '@/lib/components';
import { type CommonCollectionFragment } from '@/lib/ebloc/codegen/graphql';
import { formatDate } from '@/lib/utils';

import { CollectionDetails } from '../components/collection-details/collection-details';
import { CollectionDetailsSubmitButton } from '../components/collection-details/collection-details-submit-button';
import { useCollectionDetailsForm } from '../components/collection-details/use-collection-details-form';
import { useGetCollectionDetails } from '../hooks';

export const CollectionDetailsPage = () => {
  const { id } = useParams();
  const { collection, isLoading } = useGetCollectionDetails(id ?? '');

  if (isLoading) {
    return <LogoLoader />;
  }

  if (!collection) {
    return <Navigate to="/collections" />;
  }

  return <Page collection={collection} />;
};

const Page = ({ collection }: { collection: CommonCollectionFragment }) => {
  const form = useCollectionDetailsForm(collection);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.onSubmit}>
        <PageLayout
          title={collection.name}
          subtitle={`Added at ${formatDate(new Date(collection.createdAt as string))}`}
          actions={<CollectionDetailsSubmitButton collection={collection} />}
          backUrl="/collections"
        >
          <CollectionDetails collection={collection} />
        </PageLayout>
      </form>
    </FormProvider>
  );
};
