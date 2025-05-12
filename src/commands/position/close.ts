import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';

interface Options {
    // Currently no additional options needed
}

/**
 * Command to close a position on an exchange by its symbol
 */
export async function close(exchangeId: string, symbol: string, options: Options) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['closePosition']) {
            console.error(chalk.red('Error: The exchange does not support closing a single position.'));
            return;
        }

        const order = await exchange.closePosition(symbol);

        console.log(chalk.green(`Successfully sent a market order to close the ${symbol} position (order ID: ${order.id}, status: ${order.status})`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
