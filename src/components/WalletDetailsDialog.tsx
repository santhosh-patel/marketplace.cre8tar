
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { Wallet, Coins, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export function WalletDetailsDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { address, balance, transactions, isConnected, disconnectWallet } = useWallet();
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
      case 'purchase':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'reward':
      case 'signup':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card-strong border-white/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5" />
            Wallet Details
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Manage your wallet and view transaction history.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Balance Display */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-white">$C8R Balance</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{balance}</span>
            </div>
            {isConnected && (
              <p className="text-sm text-white/70 mt-2">
                Address: {formatAddress(address)}
              </p>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="glass-card p-4">
            <h3 className="font-medium text-white mb-3">Recent Transactions</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 glass-input rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <p className="text-sm font-medium text-white">{tx.description}</p>
                        <p className="text-xs text-white/60">
                          {tx.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      tx.type === 'mint' || tx.type === 'purchase' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {tx.type === 'mint' || tx.type === 'purchase' ? '-' : '+'}{tx.amount} C8R
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-sm text-center py-4">No transactions yet</p>
              )}
            </div>
          </div>

          {isConnected && (
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="w-full glass-button text-white border-white/30 hover:bg-white/20"
            >
              Disconnect Wallet
            </Button>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <WalletConnect />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
