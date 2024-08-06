import { useFormContext } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle, Label } from '@/lib/shared/components';
import { FormCheckbox, FormInput, FormSwitch, FormTextarea } from '@/lib/shared/form';

import { type ProductDetailsFormInput } from './use-product-details-form';

export const ProductDetails = () => {
  const { control } = useFormContext<ProductDetailsFormInput>();

  return (
    <div className="grid grid-cols-6 gap-6">
      <div className="col-span-4 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormInput control={control} name="name" label="Name" placeholder="T-Shirt" />
            <FormTextarea control={control} name="description" label="Description" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-3 w-full">
              <FormInput control={control} name="price" label="Price" placeholder="$ 0.00" />
              <FormInput
                control={control}
                name="comparisonPrice"
                label="Comparison price"
                placeholder="$ 0.00"
              />
            </div>
            <div className="flex gap-3">
              <FormInput
                control={control}
                name="costPerUnit"
                label="Cost per unit"
                placeholder="$ 0.00"
              />
              <FormInput name="Revenue" label="Revenue" placeholder="--" />
              <FormInput name="margin" label="Margin" placeholder="--" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <FormInput control={control} name="stock" label="Quantity" placeholder="0" />
            <FormInput control={control} name="sku" label="SKU" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormCheckbox name="requiresShipping" label="This product requires shipping" />
            <FormInput control={control} name="weight" label="Weigh" placeholder="0.0 kg" />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card>
          <CardContent className="flex flex-col gap-4 mt-6">
            <Label className="text-base">Product status</Label>
            <FormSwitch control={control} name="enabled" label="Active" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};