import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { formatBalance } from '../../formatters/balanceFormatter';
import { ACCOUNT_TYPES } from '../../utils/account';

interface BalanceOptions {
    type?: (typeof ACCOUNT_TYPES)[number];
}

/**
 * Command to fetch account balance
 */
export async function balance(exchangeId: string, options: BalanceOptions = {}) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);
        if (!exchange.has['fetchBalance']) {
            throw new Error(`Fetch balance is not supported by ${exchangeId}`);
        }
        const balanceData = await exchange.fetchBalance({ type: options.type });
        console.log(chalk.cyan(`Balance for ${exchangeId.toUpperCase()}:`));
        console.log(formatBalance(balanceData));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}

/**
 * Command to fetch spot account balance
 */
export async function spotBalance(exchangeId: string) {
    await balance(exchangeId, { type: 'spot' });
}

/**
 * Command to fetch future account balance
 */
export async function futureBalance(exchangeId: string) {
    await balance(exchangeId, { type: 'future' });
}
