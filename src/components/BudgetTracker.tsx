import React, { useMemo } from "react";
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
import { useEvent } from "@/context/EventContext";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "./ui/use-toast";

const categoryColors = {
  Venue: "bg-blue-500",
  Catering: "bg-green-500",
  Decoration: "bg-purple-500",
  Entertainment: "bg-yellow-500",
  Other: "bg-gray-500",
};

const TransactionCard = ({ transaction }) => {
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
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className={statusColors[transaction.status]}>
          {transaction.status}
        </Badge>
        <span className={`font-medium ${typeColors[transaction.type]}`}>
          {transaction.type === "payment" ? "-" : "+"}$
          {Number(transaction.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const BudgetTracker = () => {
  const { currentEvent } = useEvent();
  const { budgetItems, createBudgetItem, loading } = useEvents(
    currentEvent?.id,
  );

  const { totalBudget, spentAmount, categoryBreakdown } = useMemo(() => {
    const deposits = budgetItems
      .filter((item) => item.type === "deposit")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const payments = budgetItems
      .filter((item) => item.type === "payment")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const refunds = budgetItems
      .filter((item) => item.type === "refund")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const categoryTotals = budgetItems
      .filter((item) => item.type === "payment")
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
      }, {});

    return {
      totalBudget: deposits,
      spentAmount: payments - refunds,
      categoryBreakdown: Object.entries(categoryTotals).map(
        ([name, amount]) => ({
          name,
          amount,
          color: categoryColors[name] || categoryColors.Other,
        }),
      ),
    };
  }, [budgetItems]);

  const progress = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;

  const handleAddTransaction = async () => {
    if (!currentEvent) return;
    try {
      await createBudgetItem({
        description: "New Transaction",
        amount: 0,
        type: "payment",
        category: "Other",
        status: "pending",
        event_id: currentEvent.id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">
          Please create or select an event first
        </p>
      </div>
    );
  }

  return (
    <Card className="w-[350px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Tracker
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddTransaction}
            disabled={loading}
          >
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
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium">
                        ${category.amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(category.amount / spentAmount) * 100}
                      className={`h-2 ${category.color}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm">
                {progress > 90 ? "Near budget limit" : "On track with budget"}
              </span>
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
                  {budgetItems.map((transaction) => (
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
