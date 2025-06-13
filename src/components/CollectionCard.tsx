
import { TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CollectionCardProps {
  name: string;
  creator: string;
  floorPrice: string;
  totalVolume: string;
  items: number;
  owners: number;
  images: string[];
  verified?: boolean;
}

const CollectionCard = ({ 
  name, 
  creator, 
  floorPrice, 
  totalVolume, 
  items, 
  owners, 
  images,
  verified = false 
}: CollectionCardProps) => {
  return (
    <Card className="nft-card-hover overflow-hidden bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4">
          {images.slice(0, 6).map((image, index) => (
            <div key={index} className={`${index >= 3 ? 'col-span-1' : ''} relative overflow-hidden rounded-lg`}>
              <img 
                src={`https://images.unsplash.com/${image}?w=200&h=200&fit=crop`}
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {verified && (
          <Badge className="absolute top-3 right-3 bg-blue-500">
            ✓ Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xl">{name}</h3>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">+12%</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">by {creator}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Floor Price</p>
            <p className="font-semibold gradient-text">{floorPrice} ETH</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Volume</p>
            <p className="font-semibold">{totalVolume} ETH</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{items} items</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{owners} owners</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
