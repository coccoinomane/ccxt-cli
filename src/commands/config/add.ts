import chalk from 'chalk';
import { addExchangeConfig } from '../../config/keys';

/**
 * Command to add API keys for an exchange
 */
export async function add(exchangeId: string) {
    try {
        await addExchangeConfig(exchangeId);
    } catch (error) {
        console.error(chalk.red(`Error: ${error}`));
    }
}
