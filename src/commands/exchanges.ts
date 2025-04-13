import ccxt from 'ccxt';
import chalk from 'chalk';

/**
 * Command to list all exchanges supported by CCXT
 */
export function exchanges() {
  console.log(chalk.cyan('Supported exchanges:'));
  ccxt.exchanges.forEach(ex => console.log(`- ${ex}`));
}