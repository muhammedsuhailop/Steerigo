import { Transaction as ApiTransaction } from "@/features/driver/wallet/types/wallet.types";

export interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions?: ApiTransaction[];
  currency?: string;
  onWithdraw?: () => void;
  onViewHistory?: () => void;
}
