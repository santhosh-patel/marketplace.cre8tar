
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import TrendingSection from '@/components/TrendingSection';
import CollectionsSection from '@/components/CollectionsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <TrendingSection />
      <CollectionsSection />
      <Footer />
    </div>
  );
};

export default Index;
