import Conf from 'conf';
import { prompt } from 'inquirer';
import { isExchangeIdSupported } from '../utils/exchange';
import chalk from 'chalk';

const config = new Conf({
    encryptionKey: 'ccxt-cli-encryption-key', // Consider more secure approaches
    projectName: 'ccxt-cli',
});

/**
 * Add API keys for an exchange
 *
 * @param exchangeId - The exchange ID to add API keys for; use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.
 * @throws Error if the exchange is not supported by CCXT
 */
export async function addExchangeConfig(exchangeId: string) {
    // Check if the exchange is supported by CCXT
    if (!isExchangeIdSupported(exchangeId)) {
        throw new Error(`Exchange ${exchangeId} is not supported by CCXT.`);
    }

    // Config key will be the lowercase exchange ID
    const configKey = `${exchangeId.toLowerCase()}`;

    // Warn if config already exists
    if (config.has(`exchanges.${configKey}`)) {
        console.log(chalk.yellow(`Warning: Config for ${exchangeId.toLowerCase()} already exists, if you proceed, it will override the existing config, CTRL+C to cancel.`));
    }

    // Prompt for API keys
    const { apiKey, secret } = await prompt([
        {
            type: 'input',
            name: 'apiKey',
            message: `Enter API key for ${configKey}:`,
        },
        {
            type: 'password',
            name: 'secret',
            message: `Enter secret for ${configKey}:`,
        },
    ]);

    // Save config
    config.set(`exchanges.${configKey}`, { apiKey, secret });
    console.log(`Credentials for ${configKey} saved successfully`);
}

/**
 * Get API keys for an exchange
 */
export function getExchangeConfig(exchangeId: string) {
    const configKey = `${exchangeId.toLowerCase()}`;
    return config.get(`exchanges.${configKey}`);
}

/**
 * List all exchanges with configured API keys
 */
export function listExchanges() {
    const exchanges = (config.get('exchanges') as Record<string, any>) || {};
    return Object.keys(exchanges);
}

/**
 * Delete API keys for an exchange
 */
export function deleteExchangeConfig(exchangeId: string) {
    if (config.has(`exchanges.${exchangeId.toLowerCase()}`)) {
        config.delete(`exchanges.${exchangeId.toLowerCase()}`);
        console.log(`Credentials for ${exchangeId.toLowerCase()} deleted successfully`);
        return true;
    } else {
        console.log(`No credentials found for ${exchangeId.toLowerCase()}`);
        return false;
    }
}
