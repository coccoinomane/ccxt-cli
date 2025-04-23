import chalk from 'chalk';
import { getExchange } from '../../utils/exchange';

/**
 * Command to list all function NOT supported by a specific exchange
 */
export function unsupported(exchangeId: string) {
  const exchange = getExchange(exchangeId);
  console.log(chalk.cyan(`FUNCTIONS NOT SUPPORTED BY ${exchange.id}:`));
  let unsupported = 0;
  Object.keys(exchange.has).sort().forEach((func: string) => {
    if (!exchange.has[func]) {
      unsupported++;
      if (typeof exchange.has[func] === 'undefined') {
        console.log(`- ${func} (not defined)`);
      } else {
        console.log(`- ${func}`);
      }
    }
  });
  console.log(chalk.cyan(`${unsupported} functions NOT supported by ${exchange.id}`));
}
