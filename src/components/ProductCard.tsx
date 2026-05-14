import { memo, useState } from 'react';
import type { Product } from '../types';
import { track } from '../utils/analytics';

type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(prev => !prev);
    if (!saved) {
      track('saved_deal', {
        productId: product.id,
        productName: product.name,
        price: product.price,
      });
    }
  };

  const handleRetailerClick = () => {
    track('retailer_clicked', {
      retailer: product.retailer,
      productId: product.id,
    });
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
        onError={e => {
          const img = e.target as HTMLImageElement;
          if (!img.src.includes('placehold.co')) {
            img.src = `https://placehold.co/64x64/f3f4f6/9ca3af?text=${encodeURIComponent(product.category[0])}`;
          }
        }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </p>
        <button
          onClick={handleRetailerClick}
          className="text-xs text-emerald-600 font-medium mt-0.5 hover:underline"
        >
          {product.retailer}
        </button>
        <p className="text-xs text-gray-400 mt-0.5">{product.size}</p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="text-base font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={handleSave}
          aria-label={saved ? 'Unsave deal' : 'Save deal'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'
          }`}
        >
          <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
