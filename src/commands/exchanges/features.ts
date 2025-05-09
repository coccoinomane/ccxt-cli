import { getExchange } from '../../utils/exchange';
import util from 'util';

/**
 * Command to list all methods and functionalities supported by
 * the given exchange indexed by market-type.
 *
 * Possible market-types are:
 * 'spot' | 'margin' | 'swap' | 'future' | 'option' | 'delivery' | 'index';
 *
 * @link https://docs.ccxt.com/#/README?id=features
 */
export function features(exchangeId: string) {
    const exchange = getExchange(exchangeId);
    console.log(util.inspect(exchange.features, { depth: null, colors: true }));
}
