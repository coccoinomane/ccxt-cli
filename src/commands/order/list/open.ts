import { getAuthenticatedExchange } from '../../../utils/exchange';
import chalk from 'chalk';
import { formatOpenOrders } from '../../../formatters/orderFormatter';

export async function open(exchangeId: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['fetchOpenOrders']) {
            console.error(`Error: The exchange "${exchangeId}" does not support fetching open orders.`);
            process.exit(1);
        }

        exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;
        const openOrders = await exchange.fetchOpenOrders();

        if (openOrders.length === 0) {
            console.log('No open orders found.');
            return;
        }

        const formattedOutput = formatOpenOrders(openOrders);

        console.log(formattedOutput);
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
