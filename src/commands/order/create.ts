import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';
import { Command } from 'commander';
import { parseCustomParams } from '../../utils/commander';

interface CreateOrderOptions {
    type: string;
    side: string;
    amount: string;
    price?: string;
    force?: boolean;
}

/**
 * Command to create a new order on an exchange
 */
export async function create(exchangeId: string, symbol: string, options: CreateOrderOptions, command: Command) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        const { type, side, amount, price, force } = options;

        // Parse custom parameters directly from process.argv
        const params = parseCustomParams();

        // For market orders, price must not be specified
        if (type === 'market' && price) {
            console.log(chalk.red('Cannot specify price for market orders.'));
            return;
        }

        // For limit orders, price is required
        if (type === 'limit' && !price) {
            console.log(chalk.red('Price is required for limit orders.'));
            return;
        }

        // Check that market exists
        const market = await exchange.loadMarkets();
        if (!market[symbol]) {
            console.log(chalk.red('Market not found.'));
            return;
        }

        // Get base and quote currencies
        const base = market[symbol].base;
        const quote = market[symbol].quote;

        // Confirm order creation
        let orderDesc = `${side} ${amount} ${base}`;
        if (type === 'limit' && price) {
            orderDesc += ` @ ${price} ${quote} (limit order)`;
        } else {
            orderDesc += ` at current price (market order)`;
        }

        // Add params information to description if present
        if (Object.keys(params).length > 0) {
            orderDesc += ` with custom parameters: ${JSON.stringify(params)}`;
        }

        const confirmed = await confirmAction(`Are you sure you want to ${orderDesc}?`, force);

        if (!confirmed) {
            console.log('Order creation cancelled.');
            return;
        }

        // Create order with params
        const order = await exchange.createOrder(
            symbol,
            type,
            side,
            parseFloat(amount),
            type === 'limit' && price ? parseFloat(price) : undefined,
            Object.keys(params).length > 0 ? params : undefined,
        );

        console.log(chalk.green('Order created:'));
        console.log(JSON.stringify(order, null, 2));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
