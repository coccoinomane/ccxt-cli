import chalk from 'chalk';
import { getExchange } from '../../utils/exchange';

/**
 * Command to list functions supported by a specific exchange
 */
export function supported(exchangeId: string) {
    const exchange = getExchange(exchangeId);
    let supported = 0;
    Object.keys(exchange.has)
        .sort()
        .forEach((func: string) => {
            if (exchange.has[func]) {
                supported++;
                if (exchange.has[func] === 'emulated') {
                    console.log(`- ${func} (emulated)`);
                } else {
                    console.log(`- ${func}`);
                }
            }
        });
    console.log(chalk.cyan(`${supported} functions supported by ${exchange.id}`));
}
