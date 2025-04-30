import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { formatBalance } from '../../formatters/balanceFormatter';

/**
 * Command to fetch account balance
 */
export async function balance(exchangeId: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        // Fetch balance
        const balanceData = await exchange.fetchBalance();

        // Format and display
        console.log(chalk.cyan(`Balance for ${exchangeId.toUpperCase()}:`));
        console.log(formatBalance(balanceData));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
