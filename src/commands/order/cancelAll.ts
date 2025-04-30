import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';
import { Order } from 'ccxt';

interface CancelOrderOptions {
    symbol?: string;
    force?: boolean;
}

/**
 * Command to cancel all open orders on an exchange
 */
export async function cancelAll(exchangeId: string, options: CancelOrderOptions) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        const { symbol, force } = options;

        if (!exchange.has['cancelAllOrders']) {
            console.error(chalk.red('Error: The exchange does not support canceling all orders.'));
            return;
        }

        // Get all open orders
        const orders = await exchange.fetchOpenOrders(symbol);
        const ordersOnMarket = symbol ? orders.filter((order) => order.symbol === symbol) : orders;
        if (ordersOnMarket.length === 0) {
            console.log(`No open orders to cancel on market ${symbol}.`);
            return;
        }

        console.log(`The following orders will be cancelled: ${ordersOnMarket.map((order) => order.id).join(', ')}`);

        const confirmed = await confirmAction(`Are you sure you want to cancel the above orders?`, force);

        if (!confirmed) {
            console.log(`Order cancellation cancelled.`);
            return;
        }

        // Cancel order
        const cancelledOrders = (await exchange.cancelAllOrders(symbol)) as Order[];

        console.log(chalk.green(`All open orders ${symbol ? `on market ${symbol}` : ''} cancelled (${cancelledOrders.length}).`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
