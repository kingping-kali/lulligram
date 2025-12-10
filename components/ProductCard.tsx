import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Product, User } from '../types';
import { MOCK_USERS } from '../constants';

interface ProductCardProps {
  product: Product;
  onChat: (userId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onChat }) => {
  const seller: User = MOCK_USERS[product.sellerId] || { 
    id: 'unknown',
    username: 'Unknown', 
    fullName: 'Unknown User',
    avatar: 'https://via.placeholder.com/150',
    bio: '',
    followers: 0,
    following: 0
  };
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 pb-4 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <img src={seller.avatar} className="w-8 h-8 rounded-full object-cover" alt={seller.username} />
          <span className="font-semibold text-sm">{seller.username}</span>
        </div>
        <button className="text-gray-500 hover:text-gray-900">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold">
          ${product.price}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked(!liked)}>
            <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
          </button>
          <button onClick={() => onChat(product.sellerId)}>
            <MessageCircle className="w-6 h-6 text-gray-900" />
          </button>
          <button>
            <Share2 className="w-6 h-6 text-gray-900" />
          </button>
        </div>
        <button>
          <Bookmark className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 pt-2">
        <p className="font-semibold text-sm">{product.likes + (liked ? 1 : 0)} likes</p>
        <div className="mt-1 text-sm">
          <span className="font-semibold mr-2">{seller.username}</span>
          <span className="text-gray-800">{product.title}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-400 mt-2 uppercase">{new Date(product.createdAt).toLocaleDateString()}</p>
      </div>
      
      {/* Quick Action */}
      <div className="px-3 mt-3">
         <button 
            onClick={() => onChat(product.sellerId)}
            className="w-full bg-gray-100 text-gray-900 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
        >
            Make Offer
         </button>
      </div>
    </div>
  );
};

export default ProductCard;