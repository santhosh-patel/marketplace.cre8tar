
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUpRight, ArrowDownLeft, Zap, ShoppingCart, Coins } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface Transaction {
  id: string;
  type: 'mint' | 'purchase' | 'stake' | 'reward' | 'transfer';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export function TransactionHistory() {
  const { transactions } = useWallet();
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Sort transactions by timestamp (newest first)
    const sorted = [...transactions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setSortedTransactions(sorted);
  }, [transactions]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return <Zap className="w-4 h-4 text-blue-500" />;
      case 'purchase':
        return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      case 'stake':
        return <Coins className="w-4 h-4 text-green-500" />;
      case 'reward':
        return <ArrowDownLeft className="w-4 h-4 text-yellow-500" />;
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = ['mint', 'purchase', 'stake'].includes(type) ? '-' : '+';
    return `${sign}${amount} $C8R`;
  };

  return (
    <Card className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300">
      <CardHeader>
        <CardTitle className="text-white dark:text-white text-gray-900">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length > 0 ? (
          <div className="space-y-4">
            {sortedTransactions.slice(0, 20).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 glass-card border-white/20 dark:border-white/20 border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-white dark:text-white text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-white/70 dark:text-white/70 text-gray-600">
                      {transaction.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    ['mint', 'purchase', 'stake'].includes(transaction.type) 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-white/40 dark:text-white/40 text-gray-400 mx-auto mb-4" />
            <p className="text-white/70 dark:text-white/70 text-gray-600">No transactions yet</p>
            <p className="text-sm text-white/50 dark:text-white/50 text-gray-500 mt-1">
              Your transaction history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
