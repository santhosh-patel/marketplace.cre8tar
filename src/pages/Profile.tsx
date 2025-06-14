
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User, Circle, Image, Clock, Award, Wallet, Coins, Settings } from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";
import { WalletDetailsDialog } from "@/components/WalletDetailsDialog";
import { NFTDetailsDialog } from "@/components/NFTDetailsDialog";
import { UserSettings } from "@/components/UserSettings";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { balance, purchasedPlugins } = useWallet();
  const navigate = useNavigate();
  const [walletDetailsOpen, setWalletDetailsOpen] = useState(false);
  const [nftDetailsOpen, setNftDetailsOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfile();
    fetchNFTs();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNFTs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('minted_nfts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNfts(data || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNftClick = (nft: any) => {
    setSelectedNft(nft);
    setNftDetailsOpen(true);
  };

  const handleAddPluginToNft = (nftId: string, pluginId: string) => {
    console.log(`Adding plugin ${pluginId} to NFT ${nftId}`);
    // In real app, save this to database
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 glass-card">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rohum-blue to-rohum-pink p-1">
                  <div className="w-full h-full rounded-full glass-card flex items-center justify-center">
                    <User className="w-10 h-10 text-white dark:text-white text-gray-900" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-white dark:text-white text-gray-900">
                  Welcome back, <span className="gradient-text">{profile?.name || "User"}!</span>
                </h1>
                <p className="text-white/70 dark:text-white/70 text-gray-600 mb-2">
                  {profile?.email}
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-400">
                    {balance} $C8R
                  </span>
                </div>
              </div>
              <div className="md:ml-auto flex gap-3">
                <Button 
                  variant="outline" 
                  className="glass-button text-white dark:text-white text-gray-900 border-white/30 dark:border-white/30 border-gray-300"
                  onClick={() => setWalletDetailsOpen(true)}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Details
                </Button>
                <WalletConnect />
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="glass-button text-white dark:text-white text-gray-900 border-white/30 dark:border-white/30 border-gray-300"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="avatars" className="w-full">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 glass-card">
                <TabsTrigger value="avatars" className="text-white dark:text-white text-gray-900 data-[state=active]:bg-white/20">Avatars</TabsTrigger>
                <TabsTrigger value="plugins" className="text-white dark:text-white text-gray-900 data-[state=active]:bg-white/20">Plugins</TabsTrigger>
                <TabsTrigger value="transactions" className="text-white dark:text-white text-gray-900 data-[state=active]:bg-white/20">Transactions</TabsTrigger>
                <TabsTrigger value="settings" className="text-white dark:text-white text-gray-900 data-[state=active]:bg-white/20">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="avatars" className="mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-white dark:text-white text-gray-900">Loading your avatars...</p>
                  </div>
                ) : nfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nfts.map((nft) => (
                      <Card 
                        key={nft.id} 
                        className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300 hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => handleNftClick(nft)}
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center text-sm text-white dark:text-white text-gray-900">
                            <span>{nft.name}</span>
                            <Circle className="w-4 h-4 text-green-500 fill-current" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square rounded-md overflow-hidden glass-card">
                            {nft.image_url ? (
                              <img 
                                src={nft.image_url} 
                                alt={nft.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-12 h-12 text-white/40 dark:text-white/40 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-white/70 dark:text-white/70 text-gray-600">
                              <strong>Type:</strong> {nft.nft_type}
                            </p>
                            <p className="text-xs text-white/70 dark:text-white/70 text-gray-600">
                              <strong>Role:</strong> {nft.role_type}
                            </p>
                            <p className="text-xs text-white/70 dark:text-white/70 text-gray-600">
                              <strong>Royalty:</strong> {nft.royalty_percentage}%
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button variant="outline" size="sm" className="glass-button text-white dark:text-white text-gray-900 border-white/30 dark:border-white/30 border-gray-300">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300 hover:border-primary/50 transition-all">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center text-white dark:text-white text-gray-900">
                          <span>No Avatars</span>
                          <Circle className="w-4 h-4 text-white/40 dark:text-white/40 text-gray-400" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-md glass-card flex items-center justify-center">
                          <Image className="w-12 h-12 text-white/40 dark:text-white/40 text-gray-400" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Button variant="outline" onClick={() => navigate("/mint")} className="glass-button text-white dark:text-white text-gray-900 border-white/30 dark:border-white/30 border-gray-300">
                          Mint Avatar
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="plugins" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedPlugins.length > 0 ? (
                    purchasedPlugins.map((plugin) => (
                      <Card key={plugin.id} className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300">
                        <CardHeader>
                          <CardTitle className="text-white dark:text-white text-gray-900">{plugin.name}</CardTitle>
                          <CardDescription className="text-white/70 dark:text-white/70 text-gray-600">{plugin.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-32 glass-card rounded-lg flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full glass-input flex items-center justify-center">
                              <span className="text-2xl text-white dark:text-white text-gray-900">{plugin.name.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm text-white/60 dark:text-white/60 text-gray-500">Purchased</span>
                            <span className="text-sm text-white/80 dark:text-white/80 text-gray-700">
                              {plugin.purchasedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-white/70 dark:text-white/70 text-gray-600 mb-4">
                        You haven't purchased any plugins yet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="glass-button text-white dark:text-white text-gray-900 border-white/30 dark:border-white/30 border-gray-300"
                        onClick={() => navigate("/marketplace")}
                      >
                        Browse Marketplace
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <TransactionHistory />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <UserSettings profile={profile} onProfileUpdate={fetchProfile} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <WalletDetailsDialog open={walletDetailsOpen} onOpenChange={setWalletDetailsOpen} />
      
      {selectedNft && (
        <NFTDetailsDialog 
          open={nftDetailsOpen} 
          onOpenChange={setNftDetailsOpen}
          nft={selectedNft}
          userPlugins={purchasedPlugins}
          onAddPlugin={handleAddPluginToNft}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Profile;
