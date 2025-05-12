import { getAuthenticatedExchange } from '../../utils/exchange';
import chalk from 'chalk';

/**
 * Command to set the user leverage for the given market
 */
export async function setLeverage(exchangeId: string, symbol: string, leverage: number) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['setLeverage']) {
            throw new Error(`Set leverage is not supported by ${exchangeId}`);
        }
        await exchange.setLeverage(leverage, symbol);

        console.log(chalk.cyan(`Leverage for ${symbol} on ${exchangeId.toUpperCase()} set to ${leverage}`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
