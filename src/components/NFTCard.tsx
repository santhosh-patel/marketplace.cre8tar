
import { Heart, Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NFTCardProps {
  title: string;
  artist: string;
  price: string;
  image: string;
  likes: number;
  views: number;
  rarity?: string;
}

const NFTCard = ({ title, artist, price, image, likes, views, rarity }: NFTCardProps) => {
  return (
    <Card className="nft-card-hover overflow-hidden bg-white border-gray-200">
      <div className="relative">
        <img 
          src={`https://images.unsplash.com/${image}?w=400&h=400&fit=crop`}
          alt={title}
          className="w-full h-64 object-cover"
        />
        {rarity && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500">
            {rarity}
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {artist}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Current Price</p>
            <p className="font-bold text-lg gradient-text">{price} ETH</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
