import { getAuthenticatedExchange } from '../../utils/exchange';
import chalk from 'chalk';
import { validateMarketSymbol } from '../../utils/validation';
import util from 'util';

/**
 * Command to get the user leverage for the given market
 */
export async function getLeverage(exchangeId: string, symbol: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['fetchLeverage']) {
            throw new Error(`Fetch leverage is not supported by ${exchangeId}`);
        }
        await validateMarketSymbol(exchange, symbol);
        const leverage = await exchange.fetchLeverage(symbol);
        console.log(chalk.cyan(`Leverage for ${symbol} on ${exchangeId.toUpperCase()}:`, util.inspect(leverage, { depth: null, colors: true })));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
