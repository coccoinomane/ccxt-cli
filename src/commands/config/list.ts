import { listExchanges } from '../../config/keys';
import chalk from 'chalk';

/**
 * Command to list all configured exchanges
 */
export function list() {
  const exchanges = listExchanges();
  if (exchanges.length === 0) {
    console.log('No exchanges configured. Use `ccxt-cli config add <exchange>` to add one.');
  } else {
    console.log(chalk.cyan('Configured exchanges:'));
    exchanges.forEach(ex => console.log(`- ${ex}`));
  }
} 