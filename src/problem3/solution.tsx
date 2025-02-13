/*
##### Issues and Anti-Patterns:
1.Type Safety Issues
- blockchain parameter in getPriority is typed as any
- Missing TypeScript interface for the complete WalletBalance (blockchain property is used but not defined)
- Using index as key in the map function is an anti-pattern
2. Logic Issues
- The filter logic appears broken (lhsPriority is undefined, should be balancePriority)
- The filter condition is inverted - it returns true for balances ≤ 0, which is likely not intended
- Inconsistent sorting logic with priorities
3. Performance Issues
- formattedBalances is calculated but never used
- Multiple iterations over the same data (filter, sort, map)
- Unnecessary spreading of props (...rest)
4. Code Organization
- getPriority function should be outside the component or memoized
- Magic numbers in priority values
- Missing error handling for price lookups

#### Improvements Made:
1. Type Safety
- Added proper TypeScript types and enums
- Removed any types
- Better key generation for list items
2. Performance
- Combined multiple operations into a single memoized chain
- Removed unused formattedBalances variable
- Memoized priority mapping
3. Code Organization
- Moved constants and types outside component
- Added proper null checking for prices
- Simplified logic flow
4. Logic Fixes
- Fixed filtering logic
- Simplified sorting with numerical comparison
- Added proper null checks
5. Best Practices
- Used enum for blockchain names
- Proper type definitions
- Better prop spreading
- Added proper null checking for prices with nullish coalescing
6. Additional Improvements
- Added comments for better code documentation
- Separated concerns (helper functions vs component logic)
- More maintainable priority system using Record type
- Better naming conventions
This refactored version is more type-safe, performant, and maintainable while fixing the logical issues present in the original code.
*/

import React, { useMemo } from "react";
interface BoxProps {
  className?: string;
  // Other props
}

// Enums and Constants
enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  [Blockchain.Osmosis]: 100,
  [Blockchain.Ethereum]: 50,
  [Blockchain.Arbitrum]: 30,
  [Blockchain.Zilliqa]: 20,
  [Blockchain.Neo]: 20,
};

// Interfaces
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

// Helper Functions
const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

const formatBalance = (amount: number): string => {
  return amount.toFixed();
};

// Component
const WalletPage: React.FC<BoxProps> = ({ className, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => {
        const priorityA = getPriority(a.blockchain);
        const priorityB = getPriority(b.blockchain);
        return priorityB - priorityA;
      })
      .map((balance) => ({
        ...balance,
        formatted: formatBalance(balance.amount),
        usdValue: (prices[balance.currency] ?? 0) * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div className={className} {...rest}>
      {sortedAndFormattedBalances.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
