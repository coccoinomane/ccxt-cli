import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * Format account balance into a readable table
 */
export function formatBalance(balance: any) {
  // Filter out zero balances and format in a clean table
  const nonZeroBalances = Object.entries(balance.total || {})
    .filter(([, amount]) => parseFloat(amount as any) > 0)
    .sort(([currA], [currB]) => currA.localeCompare(currB));

  if (nonZeroBalances.length === 0) {
    return 'No balance found.';
  }

  const table = new Table({
    head: [
      chalk.cyan('Currency'), 
      chalk.cyan('Total'), 
      chalk.cyan('Available'), 
      chalk.cyan('In Orders')
    ]
  });

  nonZeroBalances.forEach(([currency, total]) => {
    const free = balance.free[currency] || 0;
    const used = balance.used[currency] || 0;
    
    table.push([
      currency,
      parseFloat(total as any).toFixed(8),
      parseFloat(free as any).toFixed(8),
      used > 0 ? parseFloat(used as any).toFixed(8) : '0.00000000'
    ]);
  });

  return table.toString();
} 