import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction, FuelType } from '@/types';
import { formatCurrency, pumps } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const fuelBadgeStyles: Record<FuelType, string> = {
  RON95: 'bg-primary/10 text-primary border-primary/20',
  E5: 'bg-success/10 text-success border-success/20',
  DO: 'bg-secondary/10 text-secondary border-secondary/20',
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPumpCode = (pumpId: string) => {
    return pumps.find((p) => p.id === pumpId)?.code || pumpId;
  };

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Giao dịch gần đây</h3>
        <a href="/sales" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </div>
      <div className="divide-y">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                transaction.paymentMethod === 'cash' ? 'bg-success/10' : 'bg-primary/10'
              )}>
                {transaction.paymentMethod === 'cash' ? (
                  <ArrowUpRight className="h-5 w-5 text-success" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getPumpCode(transaction.pumpId)}</span>
                  <Badge variant="outline" className={cn('text-[10px]', fuelBadgeStyles[transaction.fuelType])}>
                    {transaction.fuelType}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTime(transaction.timestamp)} • {transaction.quantity} lít
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(transaction.total)}</p>
              <p className="text-xs text-muted-foreground">
                {transaction.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
