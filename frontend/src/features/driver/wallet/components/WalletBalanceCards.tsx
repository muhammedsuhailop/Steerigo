import React from "react";

interface WalletBalanceCardsProps {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  isLoading?: boolean;
}

const WalletBalanceCards: React.FC<WalletBalanceCardsProps> = ({
  availableBalance,
  pendingBalance,
  currency,
  isLoading,
}) => {
  const displayCurrency = currency === "INR" ? "₹" : currency;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Available Balance */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm border border-blue-500/20 transition-all duration-200 hover:shadow-md">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
            Available Balance
          </p>

          <h2 className="text-4xl font-bold mt-3 tracking-tight">
            {isLoading ? (
              <span className="animate-pulse">---</span>
            ) : (
              `${displayCurrency} ${availableBalance.toLocaleString()}`
            )}
          </h2>
        </div>
      </div>

      {/* Pending Balance */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-white/80 backdrop-blur border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Pending Clearance
        </p>

        <h2 className="text-4xl font-bold mt-3 text-gray-900 tracking-tight">
          {isLoading ? (
            <span className="animate-pulse text-gray-300">---</span>
          ) : (
            `${displayCurrency} ${pendingBalance.toLocaleString()}`
          )}
        </h2>
      </div>
    </div>
  );
};

export default WalletBalanceCards;
