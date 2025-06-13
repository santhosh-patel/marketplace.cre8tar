
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Vote, Lock, BarChart, Coins } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface StakeInfo {
  amount: number;
  lockDate: Date;
  unlockDate: Date;
  rewards: number;
  votingPower: number;
}

const Stake = () => {
  const { user } = useAuth();
  const { balance, addTransaction } = useWallet();
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStakeInfo();
  }, [user]);

  const loadStakeInfo = () => {
    if (!user) return;
    
    const savedStakeInfo = localStorage.getItem(`stake_${user.id}`);
    if (savedStakeInfo) {
      const parsed = JSON.parse(savedStakeInfo);
      setStakeInfo({
        ...parsed,
        lockDate: new Date(parsed.lockDate),
        unlockDate: new Date(parsed.unlockDate)
      });
    }
  };

  const handleStake = async () => {
    if (!user) return;

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${amount} $C8R to stake. Your current balance is ${balance} $C8R.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const lockDate = new Date();
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + 30); // 30 days minimum lock

      const newStakeInfo: StakeInfo = {
        amount,
        lockDate,
        unlockDate,
        rewards: 0,
        votingPower: amount
      };

      setStakeInfo(newStakeInfo);
      localStorage.setItem(`stake_${user.id}`, JSON.stringify(newStakeInfo));

      addTransaction({
        type: 'stake',
        amount,
        description: `Staked ${amount} $C8R for 30 days`
      });

      toast({
        title: "Tokens Staked!",
        description: `Successfully staked ${amount} $C8R. You'll earn 12% annual yield.`,
      });

      setStakeAmount("");
    } catch (error) {
      console.error("Staking error:", error);
      toast({
        title: "Staking Failed",
        description: "There was an error staking your tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = () => {
    if (!stakeInfo) return;

    // Calculate rewards based on time staked (simplified)
    const daysStaked = Math.floor((new Date().getTime() - stakeInfo.lockDate.getTime()) / (1000 * 60 * 60 * 24));
    const calculatedRewards = (stakeInfo.amount * 0.12 * daysStaked) / 365;

    if (calculatedRewards > 0) {
      addTransaction({
        type: 'claim',
        amount: calculatedRewards,
        description: `Claimed ${calculatedRewards.toFixed(2)} $C8R staking rewards`
      });

      setStakeInfo(prev => prev ? { ...prev, rewards: 0 } : null);

      toast({
        title: "Rewards Claimed!",
        description: `You have claimed ${calculatedRewards.toFixed(2)} $C8R in staking rewards.`,
      });
    }
  };

  const handleUnstake = () => {
    if (!stakeInfo) return;

    const now = new Date();
    if (now < stakeInfo.unlockDate) {
      toast({
        title: "Tokens Still Locked",
        description: `Your tokens are locked until ${stakeInfo.unlockDate.toLocaleDateString()}.`,
        variant: "destructive"
      });
      return;
    }

    addTransaction({
      type: 'unstake',
      amount: stakeInfo.amount,
      description: `Unstaked ${stakeInfo.amount} $C8R`
    });

    localStorage.removeItem(`stake_${user?.id}`);
    setStakeInfo(null);

    toast({
      title: "Tokens Unstaked!",
      description: `Successfully unstaked ${stakeInfo.amount} $C8R.`,
    });
  };

  const calculateRewards = () => {
    if (!stakeInfo) return 0;
    const daysStaked = Math.floor((new Date().getTime() - stakeInfo.lockDate.getTime()) / (1000 * 60 * 60 * 24));
    return (stakeInfo.amount * 0.12 * daysStaked) / 365;
  };

  const isUnlocked = stakeInfo ? new Date() >= stakeInfo.unlockDate : false;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 glass-card">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2 text-white">
                Staking & <span className="gradient-text">Governance</span>
              </h1>
              <p className="text-white/70">
                Stake $C8R tokens to earn yield and participate in DAO governance.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 glass-card">
                <TabsTrigger value="stake" className="text-white data-[state=active]:bg-white/20">Staking</TabsTrigger>
                <TabsTrigger value="governance" className="text-white data-[state=active]:bg-white/20">Governance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stake" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="glass-card-strong border-white/30">
                    <CardHeader>
                      <CardTitle className="text-white">Stake $C8R</CardTitle>
                      <CardDescription className="text-white/70">
                        Stake your tokens to earn rewards and voting power.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium block mb-2 text-white">
                            Amount to Stake
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              className="glass-input text-white border-white/30"
                              disabled={!!stakeInfo}
                            />
                            <Button 
                              variant="outline" 
                              onClick={() => setStakeAmount(balance.toString())}
                              className="glass-button text-white border-white/30"
                              disabled={!!stakeInfo}
                            >
                              Max
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg glass-card">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/70">Current Balance</span>
                            <span className="text-sm font-medium text-white flex items-center gap-1">
                              <Coins className="h-4 w-4 text-yellow-500" />
                              {balance} $C8R
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/70">Annual Yield</span>
                            <span className="text-sm font-medium text-rohum-blue">12%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/70">Lock Period</span>
                            <span className="text-sm font-medium text-white">30 days minimum</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
                        onClick={handleStake}
                        disabled={isLoading || !!stakeInfo}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {isLoading ? "Staking..." : stakeInfo ? "Already Staked" : "Stake Tokens"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="glass-card-strong border-white/30">
                    <CardHeader>
                      <CardTitle className="text-white">Staking Stats</CardTitle>
                      <CardDescription className="text-white/70">
                        Your current staking position and rewards.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Total Staked</span>
                          <span className="text-sm font-medium text-white">
                            {stakeInfo?.amount || 0} $C8R
                          </span>
                        </div>
                        <Progress value={stakeInfo ? 100 : 0} className="bg-white/20" />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Rewards Earned</span>
                          <span className="text-sm font-medium text-white">
                            {calculateRewards().toFixed(4)} $C8R
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Voting Power</span>
                          <span className="text-sm font-medium text-white">
                            {stakeInfo?.votingPower || 0}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Unlock Date</span>
                          <span className="text-sm font-medium text-white">
                            {stakeInfo?.unlockDate.toLocaleDateString() || "--"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 glass-button text-white border-white/30" 
                          disabled={!stakeInfo || calculateRewards() <= 0}
                          onClick={handleClaimRewards}
                        >
                          Claim Rewards
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 glass-button text-white border-white/30" 
                          disabled={!stakeInfo || !isUnlocked}
                          onClick={handleUnstake}
                        >
                          Unstake
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="governance" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4">
                    <Card className="glass-card-strong border-white/30">
                      <CardHeader>
                        <CardTitle className="text-white">Governance Stats</CardTitle>
                        <CardDescription className="text-white/70">
                          Your participation in the CRE8TAR DAO.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg glass-card">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/70">Your Voting Power</span>
                            <span className="text-sm font-medium text-white">
                              {stakeInfo?.votingPower || 0} votes
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/70">Total Proposals</span>
                            <span className="text-sm font-medium text-white">24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/70">Active Proposals</span>
                            <span className="text-sm font-medium text-white">3</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            className="w-full glass-button text-white border-white/30" 
                            disabled={!stakeInfo}
                          >
                            <Vote className="mr-2 h-4 w-4" />
                            Create Proposal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-8">
                    <Card className="glass-card-strong border-white/30">
                      <CardHeader>
                        <CardTitle className="text-white">Active Proposals</CardTitle>
                        <CardDescription className="text-white/70">
                          Vote on active proposals to shape the future of CRE8TAR.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[1, 2, 3].map((id) => (
                            <div key={id} className="p-4 rounded-lg glass-card hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-white">Proposal #{id}</h4>
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Active</span>
                              </div>
                              <p className="text-sm text-white/70 mb-3">
                                {id === 1 ? "Add new emotional traits to the avatar system." :
                                 id === 2 ? "Increase staking rewards for long-term holders." :
                                 "Implement multi-chain support for the marketplace."}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={!stakeInfo}
                                    className="glass-button text-white border-white/30"
                                  >
                                    For
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={!stakeInfo}
                                    className="glass-button text-white border-white/30"
                                  >
                                    Against
                                  </Button>
                                </div>
                                <span className="text-xs text-white/60">
                                  Ends in {3 + id} days
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full glass-button text-white border-white/30"
                        >
                          View All Proposals
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Stake;
