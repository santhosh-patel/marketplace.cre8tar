
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Zap, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface PluginDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plugin: {
    name: string;
    description: string;
    price: number;
    icon: string;
  };
}

export function PluginDetailsDialog({ open, onOpenChange, plugin }: PluginDetailsDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { balance, purchasePlugin, purchasedPlugins } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const isAlreadyPurchased = purchasedPlugins.some(p => p.name === plugin.name);

  const handlePurchase = async () => {
    if (!user) {
      navigate("/auth");
      onOpenChange(false);
      return;
    }

    if (balance < plugin.price) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${plugin.price} $C8R to purchase this plugin. Your current balance is ${balance} $C8R.`,
        variant: "destructive"
      });
      return;
    }

    if (isAlreadyPurchased) {
      toast({
        title: "Already Purchased",
        description: "You already own this plugin.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await purchasePlugin({
        ...plugin,
        type: "enhancement" // Add the required type property
      });
      
      if (success) {
        toast({
          title: "Plugin Purchased!",
          description: `You have successfully purchased ${plugin.name}. ${plugin.price} $C8R has been deducted from your balance.`,
        });

        onOpenChange(false);
      } else {
        toast({
          title: "Purchase Failed",
          description: "There was an error purchasing the plugin. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to purchase plugin:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing the plugin. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-card-strong border-white/30">
        <DialogHeader>
          <DialogTitle className="text-white">{plugin.name}</DialogTitle>
          <DialogDescription className="text-white/70">{plugin.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{plugin.price} $C8R</span>
              <span className="text-sm text-white/60">≈ $199.99 USD</span>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1 glass-card rounded-lg">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-400">
                    {balance} $C8R
                  </span>
                </div>
              )}
              <Button 
                onClick={handlePurchase}
                disabled={isLoading || (user && balance < plugin.price) || isAlreadyPurchased}
                className="bg-gradient-to-r from-rohum-blue to-rohum-purple"
              >
                {isLoading ? "Purchasing..." : 
                 isAlreadyPurchased ? "Already Owned" : "Buy Now"}
              </Button>
            </div>
          </div>

          {user && balance < plugin.price && !isAlreadyPurchased && (
            <div className="p-3 glass-card rounded-lg border border-red-400/30">
              <p className="text-sm text-red-300">
                Insufficient balance. You need {plugin.price - balance} more $C8R to purchase this plugin.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Award className="text-primary" />
                  <h3 className="font-semibold text-white">Quality Assured</h3>
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Rigorously tested for emotional intelligence accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Star className="text-primary" />
                  <h3 className="font-semibold text-white">Personalized</h3>
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Adapts to your avatar's personality and learning style
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-primary" />
                  <h3 className="font-semibold text-white">Enhanced AI</h3>
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Specialized neural networks for domain expertise
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Capabilities</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                <span className="text-white/80">Dynamic emotional response calibration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                <span className="text-white/80">Real-time sentiment analysis and adaptation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                <span className="text-white/80">Personalized learning path generation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                <span className="text-white/80">Context-aware conversation handling</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Requirements</h3>
            <div className="text-sm text-white/70">
              <p>• Minimum 100 $C8R tokens in wallet</p>
              <p>• Avatar level 2 or higher</p>
              <p>• Active wallet connection</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
