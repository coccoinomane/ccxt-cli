import * as ccxt from 'ccxt';
import chalk from 'chalk';
import { getExchangeConfig } from '../config/keys';
import { debugFunctionCall, getDebugCalls, getDebugHttp } from './debug';

interface ExchangeConfig {
    apiKey: string;
    secret: string;
}

/**
 * Given an exchange ID, create and return an authenticated exchange instance
 * taking API keys from the config file.
 *
 * @param exchangeId - The exchange ID to create an authenticated exchange for; use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.
 * @throws Error if the exchange is not supported by CCXT
 */
export function getAuthenticatedExchange(exchangeId: string, options: ccxt.ConstructorArgs = {}): ccxt.Exchange {
    if (!isExchangeIdSupported(exchangeId.toLowerCase())) {
        throw new Error(`Exchange ${exchangeId.toLowerCase()} is not supported by CCXT.`);
    }

    const config = getExchangeConfig(exchangeId.toLowerCase()) as ExchangeConfig;
    if (!config) {
        throw new Error(`No API keys found for ${exchangeId.toLowerCase()}. Run 'ccxt-cli config add ${exchangeId.toLowerCase()}' first.`);
    }

    const { exchangeId: exchangeIdWithoutTestnet, isTestnet } = parseExchangeIdWithTestnet(exchangeId);

    return getExchange(exchangeIdWithoutTestnet, {
        ...options,
        apiKey: config.apiKey,
        secret: config.secret,
        enableRateLimit: true,
        verbose: getDebugHttp(),
        sandbox: isTestnet,
    });
}

/**
 * Given an exchange ID, create and return an unauthenticated exchange instance
 * that can be used to fetch public data.
 *
 * @param exchangeId - The exchange ID to create the public exchange for; use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.
 * @throws Error if the exchange is not supported by CCXT
 */
export function getPublicExchange(exchangeId: string, options: ccxt.ConstructorArgs = {}): ccxt.Exchange {
    if (!isExchangeIdSupported(exchangeId.toLowerCase())) {
        throw new Error(`Exchange ${exchangeId.toLowerCase()} is not supported by CCXT.`);
    }

    const { exchangeId: exchangeIdWithoutTestnet, isTestnet } = parseExchangeIdWithTestnet(exchangeId);

    return getExchange(exchangeIdWithoutTestnet, {
        ...options,
        enableRateLimit: true,
        verbose: getDebugHttp(),
        sandbox: isTestnet,
    });
}

/**
 * Given a CCXT exchange name (so, without the `-testnet` suffix) and optional
 * CCXT constructor arguments, create and return an exchange instance.
 *
 * @param exchangeName - The exchange name to create an exchange for.  Use vanilla CCXT exchange names, without the `-testnet` suffix, e.g. `binance`, `bybit`, `kraken`, etc.
 * @throws Error if the exchange is not supported by CCXT
 */
export function getExchange(exchangeName: string, options: ccxt.ConstructorArgs = {}): ccxt.Exchange {
    try {
        const exchange = new (ccxt as any)[exchangeName.toLowerCase()]({
            ...options,
            enableRateLimit: true,
            verbose: getDebugHttp(),
        });

        // Wrap exchange methods with debug logging
        if (getDebugCalls()) {
            wrapExchangeMethods(exchange, getDebugCalls() === 'all');
        }

        return exchange;
    } catch (error) {
        throw new Error(`Exchange ${exchangeName} is not supported by CCXT.`);
    }
}

/**
 * Wrap exchange methods with debug logging
 */
function wrapExchangeMethods(exchange: ccxt.Exchange, verbose: boolean): void {
    // Common API methods to wrap
    let methodsToWrap = ['fetchBalance', 'fetchOrder', 'createOrder', 'cancelOrder', 'fetchTicker', 'withdraw', 'fetchOpenOrders'];

    if (verbose) {
        methodsToWrap = [];
        Object.keys(exchange.has).forEach((method) => {
            if (exchange.has[method]) {
                methodsToWrap.push(method);
            }
        });
    }

    methodsToWrap.forEach((method) => {
        // Use type assertion to allow indexing with string
        const exchangeAny = exchange as any;
        if (exchangeAny[method]) {
            const originalMethod = exchangeAny[method].bind(exchange);
            exchangeAny[method] = (...args: any[]) => debugFunctionCall(method, originalMethod, ...args);
        }
    });
}

/**
 * Given an exchange ID, return true if the exchange is supported by CCXT.
 *
 * If the exchange ID is a testnet exchange, the function will also test
 * whether the exchange supports sandbox trading in CCXT.
 *
 * @param exchangeId - The exchange ID to check; use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.
 * @returns True if the exchange is supported by CCXT, false otherwise
 */
export function isExchangeIdSupported(exchangeId: string): boolean {
    const { exchangeId: exchangeIdWithoutTestnet, isTestnet } = parseExchangeIdWithTestnet(exchangeId);
    try {
        const exchange = new (ccxt as any)[exchangeIdWithoutTestnet.toLowerCase()]({
            enableRateLimit: true,
        });
        if (isTestnet && !exchange.has['sandbox']) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Parse an exchange ID into a CCXT exchange ID and testnet flag.
 * For example, `binance-testnet` will be parsed into `binance` and `true`,
 * while `binance` will be parsed into `binance` and `false`.
 *
 * @param exchangeId - The exchange ID to parse; use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.
 * @returns The parsed exchange ID and testnet flag
 * @throws Error if the exchange is not supported by CCXT
 */
export function parseExchangeIdWithTestnet(exchangeId: string): { exchangeId: string; isTestnet: boolean } {
    const isTestnet = exchangeId.endsWith('-testnet');
    const exchangeIdWithoutTestnet = isTestnet ? exchangeId.slice(0, -8) : exchangeId;
    return { exchangeId: exchangeIdWithoutTestnet, isTestnet };
}

/**
 * Check if a currency requires additional steps for operations
 */
export async function checkCurrencyRequirements(exchange: ccxt.Exchange, currency: string, operation: 'deposit' | 'withdraw') {
    try {
        const currencies = await exchange.fetchCurrencies();
        const currencyInfo = currencies[currency.toUpperCase()];

        if (!currencyInfo) {
            console.log(chalk.yellow(`Warning: Currency ${currency} information not available.`));
            return;
        }

        // Check if withdrawal is disabled
        if ((operation === 'withdraw' && currencyInfo.withdraw === false) || (currencyInfo as any).withdrawal?.disabled) {
            throw new Error(`Withdrawals for ${currency} are currently disabled on ${exchange.id}.`);
        }

        // Check if deposit is disabled
        if ((operation === 'deposit' && currencyInfo.deposit === false) || (currencyInfo as any).deposit?.disabled) {
            throw new Error(`Deposits for ${currency} are currently disabled on ${exchange.id}.`);
        }

        // Show warning about address whitelisting if applicable
        if (operation === 'withdraw') {
            console.log(chalk.yellow(`NOTE: ${exchange.id} may require address whitelisting on their website before withdrawal.`));
        }
    } catch (error) {
        // If fetchCurrencies is not available, just show a generic warning
        console.log(chalk.yellow(`NOTE: ${exchange.id} may require additional setup on their website for ${operation} operations.`));
    }
}
