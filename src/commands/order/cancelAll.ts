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

        const confirmed = await confirmAction(`Are you sure you want to cancel all your open orders${symbol ? ` on market ${symbol}` : ''}?`, force);
        if (!confirmed) {
            console.log(`Order cancellation cancelled.`);
            return;
        }

        // If no market is provided, let's try cancelling all orders using
        // cancelAllOrders() without symbol
        if (!symbol) {
            try {
                await exchange.cancelAllOrders();
                console.log(chalk.green(`All open orders have been cancelled.`));
                return;
            } catch (error: any) {
                console.log(chalk.grey('The exchange does not support canceling all orders in one go, will cancel orders market by market.'));
                // If the exchange does not support canceling all orders without a market,
                // we'll fetch all open orders and cancel them market by market
            }
        } else {
            // Cancel all orders for the specific market
            await exchange.cancelAllOrders(symbol);
            console.log(chalk.green(`All open orders on market ${symbol} have been cancelled.`));
            return;
        }

        // If we are here, it means that the user wants to cancel all orders,
        // but the exchange does not support canceling all orders in one go,
        // so we'll fetch all open orders and cancel them market by market

        // Get all open orders
        exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;
        const orders = await exchange.fetchOpenOrders(symbol);
        if (orders.length === 0) {
            console.log('No open orders found.');
            return;
        }

        // Loop through all markets with open orders and cancel them
        const marketsWithOrders = [...new Set(orders.map((order) => order.symbol))];
        for (const market of marketsWithOrders) {
            await exchange.cancelAllOrders(market);
        }
        console.log(chalk.green(`All open orders have been cancelled.`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
