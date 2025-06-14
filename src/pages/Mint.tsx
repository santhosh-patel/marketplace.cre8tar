
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletConnect } from "@/components/WalletConnect";
import { AvatarCreationForm } from "@/components/AvatarCreationForm";
import { MintedAvatarDisplay } from "@/components/MintedAvatarDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const MINT_COST = 100; // Cost in C8R

const Mint = () => {
  const { user } = useAuth();
  const { balance, refreshBalance, addTransaction } = useWallet();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mintedAvatar, setMintedAvatar] = useState<any>(null);
  const [mintingProgress, setMintingProgress] = useState("");

  const updateUserBalance = async (newBalance: number) => {
    if (!user) {
      console.error('No user found when trying to update balance');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Updating user balance:', { userId: user.id, newBalance });
      const { error } = await supabase
        .from('profiles')
        .update({ c8r_balance: newBalance })
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error updating balance:', error);
        throw error;
      }
      console.log('Balance updated successfully');
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const handleMint = async (formData: any) => {
    console.log('Starting mint process with data:', formData);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      toast({
        title: "Authentication Required",
        description: "Please log in to mint an avatar.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (balance < MINT_COST) {
      console.log('Insufficient balance:', { balance, required: MINT_COST });
      toast({
        title: "Insufficient Balance",
        description: `You need ${MINT_COST} $C8R to mint an avatar. Your current balance is ${balance} $C8R.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      setMintingProgress("Preparing avatar data...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let imageUrl = "";
      
      // Upload image to storage if provided
      if (formData.imageFile) {
        setMintingProgress("Uploading avatar image...");
        console.log('Uploading image to storage');
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('nft-images')
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('nft-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Save NFT to database
      setMintingProgress("Creating NFT on blockchain...");
      console.log('Saving NFT to database');
      const nftData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        avatar_id: formData.avatarId,
        image_url: imageUrl || null,
        model_source: formData.modelSource,
        voice_sample: formData.voiceSample,
        personality_traits: formData.personalityTraits,
        role_type: formData.roleType,
        language: formData.language,
        gesture_package: formData.gesturePackage,
        nft_type: formData.nftType,
        royalty_percentage: formData.royaltyPercentage
      };

      console.log('NFT data to insert:', nftData);

      const { data: insertedNft, error: insertError } = await supabase
        .from('minted_nfts')
        .insert(nftData)
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      console.log('NFT saved to database successfully:', insertedNft);

      // Deduct C8R balance
      setMintingProgress("Processing payment...");
      console.log('Deducting balance');
      await updateUserBalance(balance - MINT_COST);
      await refreshBalance();

      // Add transaction record
      addTransaction({
        type: 'mint',
        amount: MINT_COST,
        description: `Minted avatar: ${formData.name}`
      });

      setMintingProgress("Finalizing avatar creation...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Avatar minted successfully");
      setMintedAvatar({ ...formData, imageUrl, nftId: insertedNft.id });
      
      toast({
        title: "Avatar Minted Successfully!",
        description: `Your avatar NFT has been created! ${MINT_COST} $C8R has been deducted from your balance.`
      });
      
    } catch (error) {
      console.error("Failed to mint avatar:", error);
      
      let errorMessage = "There was an error minting your avatar. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('avatar_id')) {
          errorMessage = "Avatar ID is required. Please provide a valid Avatar ID.";
        } else if (error.message.includes('violates row-level security')) {
          errorMessage = "Authentication error. Please try logging out and logging back in.";
        } else if (error.message.includes('not-null')) {
          errorMessage = "Please fill in all required fields.";
        }
      }
      
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setMintingProgress("");
    }
  };

  const handleCreateAnother = () => {
    setMintedAvatar(null);
  };

  // Show loading if user auth state is not determined yet
  if (user === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-white dark:text-white text-gray-900">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white dark:text-white text-gray-900">
                Mint Your <span className="gradient-text">Avatar NFT</span>
              </h1>
              <p className="text-white/70 dark:text-white/70 text-gray-600">
                Create a unique AI-powered avatar NFT with customizable traits, voice, and personality.
                Your avatar can generate content, earn revenue, and be deployed across platforms.
              </p>
            </div>

            {!mintedAvatar ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {isLoading && (
                    <div className="mb-6 p-4 glass-card-strong border-white/30 dark:border-white/30 border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="text-white dark:text-white text-gray-900">{mintingProgress}</span>
                      </div>
                    </div>
                  )}
                  <AvatarCreationForm onMint={handleMint} isLoading={isLoading} />
                </div>
                
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <WalletConnect />
                    
                    <div className="mt-6 glass-card-strong border-white/30 dark:border-white/30 border-gray-300 p-4">
                      <h3 className="font-semibold mb-2 text-white dark:text-white text-gray-900">Minting Cost</h3>
                      <p className="text-2xl font-bold text-blue-400">{MINT_COST} $C8R</p>
                      <p className="text-sm text-white/70 dark:text-white/70 text-gray-600 mt-1">
                        Your balance: {balance} $C8R
                      </p>
                      {balance < MINT_COST && (
                        <p className="text-sm text-red-400 mt-2">
                          Insufficient balance to mint
                        </p>
                      )}
                    </div>

                    <div className="mt-6 glass-card border-white/20 dark:border-white/20 border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 text-white dark:text-white text-gray-900">What You Get</h3>
                      <ul className="text-sm space-y-1 text-white/80 dark:text-white/80 text-gray-700">
                        <li>• ERC-721 or ERC-1155 NFT ownership</li>
                        <li>• AI content generation</li>
                        <li>• Revenue earning potential</li>
                        <li>• Cross-platform deployment</li>
                        <li>• Customizable personality</li>
                        <li>• 2-10% creator royalties</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <MintedAvatarDisplay 
                  avatarData={mintedAvatar} 
                  onCreateAnother={handleCreateAnother}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mint;
