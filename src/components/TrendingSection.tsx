
import { Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NFTCard from './NFTCard';

const TrendingSection = () => {
  const trendingNFTs = [
    {
      title: "Cosmic Explorer #2847",
      artist: "DigitalDreamer",
      price: "2.5",
      image: "photo-1487058792275-0ad4aaf24ca7",
      likes: 234,
      views: 1567,
      rarity: "Rare"
    },
    {
      title: "Neon Genesis",
      artist: "CyberArtist",
      price: "1.8",
      image: "photo-1461749280684-dccba630e2f6",
      likes: 189,
      views: 2341,
      rarity: "Epic"
    },
    {
      title: "Digital Abstract #001",
      artist: "ModernMaster",
      price: "3.2",
      image: "photo-1488590528505-98d2b5aba04b",
      likes: 456,
      views: 3892
    },
    {
      title: "Quantum Dreams",
      artist: "FutureVision",
      price: "1.9",
      image: "photo-1531297484001-80022131f5a1",
      likes: 378,
      views: 2567,
      rarity: "Legendary"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Flame className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
            </div>
            <p className="text-gray-600 text-lg">Discover the hottest NFTs in the marketplace</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNFTs.map((nft, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <NFTCard {...nft} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Explore More Trending NFTs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
