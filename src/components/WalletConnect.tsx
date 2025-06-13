
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/components/ui/use-toast";
import { WalletDetailsDialog } from "./WalletDetailsDialog";
import { useState } from "react";

export function WalletConnect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const [showDetails, setShowDetails] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      await connectWallet();
      toast({
        title: "Wallet Connected!",
        description: `Connected successfully`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected."
    });
  };

  const formatAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate("/auth")} 
        className="glass-button text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {user && (
          <div className="glass-card flex items-center gap-2 px-3 py-2">
            <Coins className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-foreground">
              {balance} $C8R
            </span>
          </div>
        )}
        
        {!isConnected ? (
          <Button 
            onClick={handleConnect} 
            className="glass-button text-white"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        ) : (
          <Button 
            onClick={() => setShowDetails(true)} 
            className="glass-card border-rohum-blue text-rohum-blue hover:bg-rohum-blue/10"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address)}
          </Button>
        )}
      </div>
      
      <WalletDetailsDialog 
        open={showDetails} 
        onOpenChange={setShowDetails}
      />
    </>
  );
}
