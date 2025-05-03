import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { formatPosition } from '../../formatters/positionFormatter';

interface GetPositionOptions {
    // Currently no additional options needed
}

/**
 * Command to get a position on an exchange by its symbol
 */
export async function get(exchangeId: string, symbol: string, options: GetPositionOptions) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['fetchPosition']) {
            console.error(chalk.red('Error: The exchange does not support fetching positions.'));
            return;
        }

        const position = await exchange.fetchPosition(symbol);
        const formattedPosition = formatPosition(position);

        console.log(chalk.green('Position:'));
        console.log(formattedPosition);
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
