import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';

interface Options {
    // Currently no additional options needed
}

/**
 * Command to close all positions on an exchange
 */
export async function closeAll(exchangeId: string, options: Options) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['closePosition']) {
            console.error(chalk.red('Error: The exchange does not support closing all positions.'));
            return;
        }

        await exchange.closeAllPositions();

        console.log(chalk.green(`Successfully sent market orders to close all positions`));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
