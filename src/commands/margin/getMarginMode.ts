import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { validateMarketSymbol } from '../../utils/validation';
import util from 'util';

/**
 * Command to get the user margin mode for a symbol on an exchange
 */
export async function getMarginMode(exchangeId: string, symbol: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['fetchMarginMode']) {
            throw new Error(`Fetch margin mode is not supported by ${exchangeId}`);
        }
        await validateMarketSymbol(exchange, symbol);
        const marginMode = await exchange.fetchMarginMode(symbol);
        console.log(chalk.cyan(`Margin mode for ${symbol} on ${exchangeId.toUpperCase()}:`, util.inspect(marginMode, { depth: null, colors: true })));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
