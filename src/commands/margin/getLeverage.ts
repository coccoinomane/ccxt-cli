import { getAuthenticatedExchange } from '../../utils/exchange';
import chalk from 'chalk';

/**
 * Command to get the user leverage for the given market
 */
export async function getLeverage(exchangeId: string, symbol: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['fetchLeverage']) {
            throw new Error(`Fetch leverage is not supported by ${exchangeId}`);
        }

        const market = await exchange.loadMarkets();
        if (!market[symbol]) {
            throw new Error(`Market ${symbol} not found on exchange ${exchangeId}`);
        }

        const leverage = await exchange.fetchLeverage(symbol);
        console.log(chalk.cyan(`Leverage for ${symbol} on ${exchangeId.toUpperCase()}:`));
        console.log(leverage);
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
