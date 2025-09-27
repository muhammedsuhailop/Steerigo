export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  timestamp: string;
  category:
    | "ride_payment"
    | "bonus"
    | "commission"
    | "withdrawal"
    | "refund"
    | "fee";
}

export interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions?: Transaction[];
  onWithdraw?: () => void;
  onViewHistory?: () => void;
  currency?: string;
}
