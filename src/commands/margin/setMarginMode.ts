import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { validateMarginMode, validateMarketSymbol } from '../../utils/validation';

/**
 * Command to set the user margin mode for a symbol
 */
export async function setMarginMode(exchangeId: string, symbol: string, marginMode: 'cross' | 'isolated') {
    try {
        validateMarginMode(marginMode);
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['setMarginMode']) {
            throw new Error(`Set margin mode is not supported by ${exchangeId}`);
        }
        await validateMarketSymbol(exchange, symbol);
        await exchange.setMarginMode(marginMode, symbol);
        console.log(chalk.cyan(`Margin mode for ${symbol} on ${exchangeId.toUpperCase()} set to ${marginMode}`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
