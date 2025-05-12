import { Exchange } from 'ccxt';

/**
 * Validate that the given string is a valid number
 */
export function validateNumber(value: string) {
    if (isNaN(Number(value))) {
        throw new Error(`Invalid number: ${value}`);
    }
}

/**
 * Validate that the given string is a positive non-zero number
 */
export function validatePositiveNonZeroNumber(value: string) {
    validateNumber(value);
    if (Number(value) <= 0) {
        throw new Error(`Number must be positive and non-zero (received: ${value})`);
    }
}

/**
 * Validate that the given string is a positive number
 */
export function validatePositiveNumber(value: string) {
    validateNumber(value);
    if (Number(value) < 0) {
        throw new Error(`Number must be positive (received: ${value})`);
    }
}

/**
 * Validate a margin mode (either cross or isolated)
 */
export function validateMarginMode(value: string) {
    if (!['cross', 'isolated'].includes(value)) {
        throw new Error(`Margin mode must be either cross or isolated (received: ${value})`);
    }
}

/**
 * Validate that the given market is valid and exists on the given exchange
 */
export async function validateMarketSymbol(exchange: Exchange, symbol: string) {
    const market = await exchange.loadMarkets();
    if (!market[symbol]) {
        throw new Error(`Market ${symbol} not found on exchange ${exchange.id}`);
    }
}
