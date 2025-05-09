import { getAuthenticatedExchange } from '../../../utils/exchange';
import chalk from 'chalk';
import { formatOpenPositions } from '../../../formatters/positionFormatter';

export async function open(exchangeId: string) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['fetchPositions']) {
            console.error(`Error: The exchange "${exchangeId}" does not support fetching open positions.`);
            process.exit(1);
        }

        const openPositions = await exchange.fetchPositions();

        if (openPositions.length === 0) {
            console.log('No open positions found.');
            return;
        }

        const formattedOutput = formatOpenPositions(openPositions);

        console.log(formattedOutput);
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
