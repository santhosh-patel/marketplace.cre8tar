import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  type: 'mint' | 'purchase' | 'reward' | 'signup' | 'stake' | 'unstake' | 'claim';
  amount: number;
  description: string;
  timestamp: Date;
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: string;
  purchasedAt: Date;
}

interface StakeInfo {
  id: string;
  amount: number;
  startDate: Date;
  lockPeriod: number;
  apy: number;
  canUnstake: boolean;
  earnedRewards: number;
}

interface WalletContextType {
  isConnected: boolean;
  address: string;
  balance: number;
  transactions: Transaction[];
  purchasedPlugins: Plugin[];
  stakes: StakeInfo[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  purchasePlugin: (plugin: Omit<Plugin, 'id' | 'purchasedAt'>) => Promise<boolean>;
  stakeTokens: (amount: number, lockPeriod: number) => Promise<boolean>;
  unstakeTokens: (stakeId: string) => Promise<boolean>;
  claimRewards: (stakeId: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchasedPlugins, setPurchasedPlugins] = useState<Plugin[]>([]);
  const [stakes, setStakes] = useState<StakeInfo[]>([]);

  useEffect(() => {
    if (user) {
      console.log('User logged in, fetching balance for:', user.id);
      fetchBalance();
      loadTransactions();
      loadPurchasedPlugins();
    } else {
      console.log('User logged out, resetting wallet');
      resetWallet();
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user) {
      console.log('No user, cannot fetch balance');
      return;
    }

    try {
      console.log('Fetching balance from Supabase for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('c8r_balance')
        .eq('user_id', user.id)
        .single();

      console.log('Balance fetch result:', data, error);

      if (error) {
        console.error('Error fetching balance:', error);
        // If profile doesn't exist, it should have been created by the auth trigger
        // but let's handle this case gracefully
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will be created by trigger on next auth event');
          setBalance(0);
        }
        return;
      }
      
      const fetchedBalance = data?.c8r_balance || 0;
      console.log('Setting balance to:', fetchedBalance);
      setBalance(fetchedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  };

  const loadTransactions = () => {
    if (!user) return;
    
    // Load transactions from localStorage for demo
    const savedTransactions = localStorage.getItem(`transactions_${user.id}`);
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions).map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      }));
      setTransactions(parsed);
      console.log('Loaded transactions:', parsed.length);
    } else {
      // Clear transactions for new session
      setTransactions([]);
      console.log('No saved transactions found');
    }
  };

  const loadPurchasedPlugins = () => {
    if (!user) return;
    
    // Load purchased plugins from localStorage for demo
    const savedPlugins = localStorage.getItem(`plugins_${user.id}`);
    if (savedPlugins) {
      const parsed = JSON.parse(savedPlugins).map((plugin: any) => ({
        ...plugin,
        purchasedAt: new Date(plugin.purchasedAt)
      }));
      setPurchasedPlugins(parsed);
      console.log('Loaded plugins:', parsed.length);
    } else {
      setPurchasedPlugins([]);
      console.log('No saved plugins found');
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) {
      console.log('No user, cannot update balance');
      return;
    }

    try {
      console.log('Updating balance to:', newBalance, 'for user:', user.id);
      const { error } = await supabase
        .from('profiles')
        .update({ c8r_balance: newBalance })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating balance:', error);
        throw error;
      }
      
      console.log('Balance updated successfully');
      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const purchasePlugin = async (plugin: Omit<Plugin, 'id' | 'purchasedAt'>): Promise<boolean> => {
    if (!user || balance < plugin.price) {
      console.log('Cannot purchase plugin - insufficient balance or no user');
      return false;
    }

    try {
      // Deduct balance
      await updateBalance(balance - plugin.price);

      // Add plugin to purchased list
      const newPlugin: Plugin = {
        ...plugin,
        id: Math.random().toString(36).substr(2, 9),
        purchasedAt: new Date()
      };

      const updatedPlugins = [...purchasedPlugins, newPlugin];
      setPurchasedPlugins(updatedPlugins);
      localStorage.setItem(`plugins_${user.id}`, JSON.stringify(updatedPlugins));

      // Add transaction
      addTransaction({
        type: 'purchase',
        amount: plugin.price,
        description: `Purchased ${plugin.name}`
      });

      return true;
    } catch (error) {
      console.error('Error purchasing plugin:', error);
      return false;
    }
  };

  const stakeTokens = async (amount: number, lockPeriod: number): Promise<boolean> => {
    if (!user || balance < amount) return false;

    try {
      // Deduct balance
      await updateBalance(balance - amount);

      // Add stake to list
      const newStake: StakeInfo = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        startDate: new Date(),
        lockPeriod,
        apy: 5,
        canUnstake: false,
        earnedRewards: 0
      };

      const updatedStakes = [...stakes, newStake];
      setStakes(updatedStakes);
      localStorage.setItem(`stakes_${user.id}`, JSON.stringify(updatedStakes));

      // Add transaction
      addTransaction({
        type: 'stake',
        amount,
        description: `Staked ${amount} tokens`
      });

      return true;
    } catch (error) {
      console.error('Error staking tokens:', error);
      return false;
    }
  };

  const unstakeTokens = async (stakeId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Find stake and update balance
      const stake = stakes.find(s => s.id === stakeId);
      if (!stake) return false;

      const updatedStakes = stakes.filter(s => s.id !== stakeId);
      setStakes(updatedStakes);
      localStorage.setItem(`stakes_${user.id}`, JSON.stringify(updatedStakes));

      // Add transaction
      addTransaction({
        type: 'unstake',
        amount: stake.amount,
        description: `Unstaked ${stake.amount} tokens`
      });

      return true;
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      return false;
    }
  };

  const claimRewards = async (stakeId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Find stake and update balance
      const stake = stakes.find(s => s.id === stakeId);
      if (!stake) return false;

      const updatedStakes = stakes.map(s => {
        if (s.id === stakeId) {
          return {
            ...s,
            canUnstake: true,
            earnedRewards: 0
          };
        }
        return s;
      });
      setStakes(updatedStakes);
      localStorage.setItem(`stakes_${user.id}`, JSON.stringify(updatedStakes));

      // Add transaction
      addTransaction({
        type: 'claim',
        amount: stake.earnedRewards,
        description: `Claimed ${stake.earnedRewards} rewards`
      });

      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (!user) {
      console.log('No user, cannot connect wallet');
      return;
    }

    try {
      console.log('Connecting wallet for user:', user.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 12);
      setAddress(mockAddress);
      setIsConnected(true);
      console.log('Wallet connected with address:', mockAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet');
    setIsConnected(false);
    setAddress("");
  };

  const resetWallet = () => {
    console.log('Resetting wallet state');
    setIsConnected(false);
    setAddress("");
    setBalance(0);
    setTransactions([]);
    setPurchasedPlugins([]);
  };

  const refreshBalance = async () => {
    console.log('Refreshing balance');
    await fetchBalance();
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    }
    
    console.log('Added transaction:', newTransaction);
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      transactions,
      purchasedPlugins,
      stakes,
      connectWallet,
      disconnectWallet,
      refreshBalance,
      addTransaction,
      purchasePlugin,
      stakeTokens,
      unstakeTokens,
      claimRewards
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
