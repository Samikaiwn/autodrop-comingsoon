import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product, Category } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      "1": "fas fa-fire",
      "2": "fas fa-map-marker-alt", 
      "3": "fas fa-laptop",
      "4": "fas fa-tshirt",
      "5": "fas fa-spa",
      "6": "fas fa-home",
    };
    return icons[categoryId] || "fas fa-tag";
  };

  const getCategoryName = (categoryId: string) => {
    const names: Record<string, string> = {
      "1": "Top deals",
      "2": "Local",
      "3": "Electronics", 
      "4": "Fashion",
      "5": "Beauty",
      "6": "Home",
    };
    return names[categoryId] || "Product";
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatRating = (rating: string) => {
    return parseFloat(rating).toFixed(1);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        <Badge className="absolute top-3 left-3 bg-primary text-white">
          <i className={`${getCategoryIcon(product.categoryId!)} mr-1`}></i>
          {getCategoryName(product.categoryId!)}
        </Badge>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors ${
            isWishlisted ? "text-red-500" : "text-gray-600"
          }`}
        >
          <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-yellow-400 text-sm">
            <i className="fas fa-star"></i>
            <span className="ml-1 text-gray-600">
              {formatRating(product.rating!)}
            </span>
          </div>
        </div>
        
        <Button
          onClick={onAddToCart}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <i className="fas fa-cart-plus"></i>
          <span>Add to Cart</span>
        </Button>
      </div>
    </div>
  );
}
