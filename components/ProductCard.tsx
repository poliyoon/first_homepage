
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-1 aspect-h-1 bg-stone-200 group-hover:opacity-75 sm:aspect-none sm:h-80">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-stone-900">
          <a href="#">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </a>
        </h3>
        <p className="text-sm text-stone-500 flex-grow">{product.description}</p>
        <p className="text-base font-semibold text-stone-900">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
