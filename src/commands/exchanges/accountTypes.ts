import { getExchange } from '../../utils/exchange';
import util from 'util';

/**
 * Command to list all account types supported by
 * the given exchange.
 *
 * For example, for Binance, the output will be:
 * {
 *   main: 'MAIN',
 *   spot: 'MAIN',
 *   funding: 'FUNDING',
 *   margin: 'MARGIN',
 *   cross: 'MARGIN',
 *   future: 'UMFUTURE',
 *   delivery: 'CMFUTURE',
 *   linear: 'UMFUTURE',
 *   swap: 'UMFUTURE',
 *   inverse: 'CMFUTURE',
 *   option: 'OPTION'
 * }
 *
 * @link https://docs.ccxt.com/#/README?id=account-types
 */
export function accountTypes(exchangeId: string) {
    const exchange = getExchange(exchangeId);
    console.log(util.inspect(exchange.options['accountsByType'], { depth: null, colors: true }));
}
