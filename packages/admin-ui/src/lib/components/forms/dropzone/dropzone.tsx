import { type FC, useState } from 'react';

import { cn } from '@ebloc/theme';
import { UploadCloudIcon } from 'lucide-react';

import { type EblocAsset } from '@/lib/ebloc/rest';
import { t } from '@/lib/locales';

import { AssetPreview } from '../../asset-preview/asset-preview';
import { DropzoneItem } from './dropzone-item';

/**
 * Dropzone component to upload files
 *
 * @example
 * ```tsx
 * <Dropzone
 *   onDrop={files => uploadFiles(files)}
 *   allAssets={defaultAssets}
 *   setChecked={setChecked}
 *   checked={checked}
 *   previews={previews}
 * />
 * ```
 */
export const Dropzone: FC<Props> = ({
  onDrop,
  allAssets = [],
  setChecked,
  checked,
  previews = [],
  className
}) => {
  const [assetToPreview, setAssetToPreview] = useState('');

  const handleCheck = (isChecked: boolean, source: string) => {
    if (isChecked) {
      setChecked([...checked, source]);
    } else {
      setChecked(checked.filter(item => item !== source));
    }
  };

  const defaultAsset = previews[0];

  if (previews?.length) {
    return (
      <>
        <div className="flex gap-4">
          <DropzoneItem
            className="w-36 h-36"
            source={defaultAsset}
            checked={checked.includes(defaultAsset)}
            onClick={() => setAssetToPreview(defaultAsset)}
            onCheck={isChecked => handleCheck(isChecked, defaultAsset)}
          />
          <div className="flex gap-4 flex-wrap">
            {previews
              .filter(preview => preview !== defaultAsset)
              .map(preview => (
                <DropzoneItem
                  key={preview}
                  className="w-16 h-16"
                  source={preview}
                  checked={checked.includes(preview)}
                  onClick={() => setAssetToPreview(preview)}
                  onCheck={isChecked => handleCheck(isChecked, preview)}
                />
              ))}
            <SingleDropzone className="w-16 h-16" onDrop={onDrop} />
          </div>
        </div>
        <AssetPreview
          asset={allAssets.find(asset => asset.source === assetToPreview)}
          source={assetToPreview}
          isOpen={!!assetToPreview}
          setIsOpen={(isOpen: boolean) => setAssetToPreview(isOpen ? assetToPreview : '')}
        />
      </>
    );
  }

  return <SingleDropzone className={className} onDrop={onDrop} isFull />;
};

const SingleDropzone: FC<SingleDropzoneProps> = ({ onDrop, isFull, className }) => {
  return (
    <label
      htmlFor="dropzone-file"
      className={cn(
        'flex flex-col items-center justify-center w-full h-full border-2 border-input hover:border-ring border-dashed rounded-lg cursor-pointer transition-colors',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloudIcon width={isFull ? 24 : 16} className="text-muted-foreground" />
        {isFull && (
          <p className="text-sm text-muted-foreground">{t('product-details.assets.placeholder')}</p>
        )}
      </div>
      <input
        // onChange={e => setAssets(getFileListIntoArray(e.target.files))}
        onChange={e => onDrop(e.target.files)}
        multiple
        id="dropzone-file"
        type="file"
        className="hidden"
      />
    </label>
  );
};

type Props = {
  onDrop: (files: FileList | null) => void;
  setChecked: (checked: string[]) => void;
  checked: string[];
  previews?: string[];
  allAssets?: DropzoneAsset[];
  className?: string;
};

type SingleDropzoneProps = {
  onDrop: (files: FileList | null) => void;
  /**
   * If true, dropzone label will be show and icon will be bigger
   */
  isFull?: boolean;
  className?: string;
};

export type DropzoneAsset = Pick<EblocAsset, 'source' | 'id' | 'name' | 'createdAt'>;
