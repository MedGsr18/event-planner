import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CreditCard,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "deposit" | "payment" | "refund";
  category: string;
  status: "pending" | "completed" | "failed";
}

interface ExpenseCategory {
  name: string;
  amount: number;
  budget: number;
  color: string;
}

interface BudgetTrackerProps {
  totalBudget?: number;
  spentAmount?: number;
  categories?: ExpenseCategory[];
  transactions?: Transaction[];
  onAddTransaction?: (transaction: Partial<Transaction>) => void;
}

const defaultCategories: ExpenseCategory[] = [
  { name: "Venue", amount: 5000, budget: 6000, color: "bg-blue-500" },
  { name: "Catering", amount: 3000, budget: 4000, color: "bg-green-500" },
  { name: "Decoration", amount: 1500, budget: 2000, color: "bg-purple-500" },
  { name: "Entertainment", amount: 2000, budget: 3000, color: "bg-yellow-500" },
];

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-03-15",
    description: "Venue Deposit",
    amount: 2000,
    type: "payment",
    category: "Venue",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-03-14",
    description: "Initial Budget",
    amount: 15000,
    type: "deposit",
    category: "Budget",
    status: "completed",
  },
  {
    id: "3",
    date: "2024-03-13",
    description: "Catering Refund",
    amount: 500,
    type: "refund",
    category: "Catering",
    status: "completed",
  },
];

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const typeColors = {
    deposit: "text-green-500",
    payment: "text-red-500",
    refund: "text-blue-500",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  const TypeIcon = {
    deposit: ArrowUpRight,
    payment: ArrowDownRight,
    refund: Receipt,
  }[transaction.type];

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${transaction.type === "deposit" ? "bg-green-100" : transaction.type === "refund" ? "bg-blue-100" : "bg-red-100"}`}
        >
          <TypeIcon className={`h-4 w-4 ${typeColors[transaction.type]}`} />
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">{transaction.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className={statusColors[transaction.status]}>
          {transaction.status}
        </Badge>
        <span className={`font-medium ${typeColors[transaction.type]}`}>
          {transaction.type === "payment" ? "-" : "+"}$
          {transaction.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  totalBudget = 15000,
  spentAmount = 11500,
  categories = defaultCategories,
  transactions = defaultTransactions,
  onAddTransaction = () => {},
}) => {
  const progress = (spentAmount / totalBudget) * 100;

  return (
    <Card className="w-[350px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Tracker
          </CardTitle>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1">
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Budget Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">
                  ${spentAmount.toLocaleString()}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  ${(totalBudget - spentAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <Separator />

            {/* Category Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <h3 className="font-semibold">Expense Breakdown</h3>
              </div>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <div className="text-right">
                        <span className="font-medium">
                          ${category.amount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          / ${category.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={(category.amount / category.budget) * 100}
                      className={`h-2 ${category.color}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm">On track with budget</span>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Transactions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <CreditCard className="h-4 w-4" />
                  Pay Vendor
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;
