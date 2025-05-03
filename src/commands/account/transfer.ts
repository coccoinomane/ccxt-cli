import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';

interface TransferOptions {
    currency: string;
    amount: number;
    from: string;
    to: string;
    force?: boolean;
}

/**
 * Command to transfer funds from an account (e.g. spot) to another account (e.g. future)
 *
 * @link https://docs.ccxt.com/#/README?id=transfers
 */
export async function transfer(exchangeId: string, options: TransferOptions) {
    try {
        const exchange = getAuthenticatedExchange(exchangeId);

        if (!exchange.has['transfer']) {
            throw new Error('Transfer is not supported by this exchange');
        }

        const allowedAccounts = exchange.options['accountsByType'];
        if (!allowedAccounts[options.from]) {
            throw new Error(`Account with name '${options.from}' does not exist on ${exchangeId}.  Allowed accounts: ${Object.keys(allowedAccounts).join(', ')}.`);
        }

        if (!allowedAccounts[options.to]) {
            throw new Error(`Account with name '${options.to}' does not exist on ${exchangeId}.  Allowed accounts: ${Object.keys(allowedAccounts).join(', ')}.`);
        }

        const confirmed = await confirmAction(
            `Are you sure you want to transfer ${options.amount} ${options.currency} from ${options.from} account to ${options.to} account?`,
            options.force,
        );

        if (!confirmed) {
            console.log('Transfer cancelled.');
            return;
        }

        // Execute transfer
        const result = await exchange.transfer(options.currency.toUpperCase(), options.amount, options.from, options.to);

        console.log(chalk.green('Transfer initiated:'));
        console.log(result);
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
