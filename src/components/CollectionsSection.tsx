
import { Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CollectionCard from './CollectionCard';

const CollectionsSection = () => {
  const featuredCollections = [
    {
      name: "CyberPunks Elite",
      creator: "PunkMaster",
      floorPrice: "2.1",
      totalVolume: "1,247",
      items: 10000,
      owners: 8421,
      images: ["photo-1488590528505-98d2b5aba04b", "photo-1461749280684-dccba630e2f6", "photo-1486312338219-ce68d2c6f44d", "photo-1531297484001-80022131f5a1", "photo-1487058792275-0ad4aaf24ca7", "photo-1581091226825-a6a2a5aee158"],
      verified: true
    },
    {
      name: "Digital Dreamscapes",
      creator: "DreamWeaver",
      floorPrice: "1.5",
      totalVolume: "892",
      items: 5000,
      owners: 3782,
      images: ["photo-1461749280684-dccba630e2f6", "photo-1488590528505-98d2b5aba04b", "photo-1531297484001-80022131f5a1", "photo-1486312338219-ce68d2c6f44d", "photo-1581091226825-a6a2a5aee158", "photo-1487058792275-0ad4aaf24ca7"],
      verified: true
    },
    {
      name: "Cosmic Creatures",
      creator: "SpaceArtist",
      floorPrice: "0.8",
      totalVolume: "456",
      items: 7500,
      owners: 4321,
      images: ["photo-1531297484001-80022131f5a1", "photo-1487058792275-0ad4aaf24ca7", "photo-1488590528505-98d2b5aba04b", "photo-1461749280684-dccba630e2f6", "photo-1486312338219-ce68d2c6f44d", "photo-1581091226825-a6a2a5aee158"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Crown className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">Featured Collections</h2>
            </div>
            <p className="text-gray-600 text-lg">Curated collections from top artists</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCollections.map((collection, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CollectionCard {...collection} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
