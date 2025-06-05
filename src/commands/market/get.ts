import chalk from 'chalk';
import { getPublicExchange } from '../../utils/exchange';

/**
 * Command to fetch market information for a symbol
 *
 * Complete market info on CCXT is:
 *
 * export interface MarketInterface {
 *    id: Str;
 *    numericId?: Num;
 *    uppercaseId?: Str;
 *    lowercaseId?: Str;
 *    symbol: string;
 *    base: string;
 *    quote: string;
 *    baseId: Str;
 *    quoteId: Str;
 *    active: Bool;
 *    type: MarketType;
 *    subType?: SubType;
 *    spot: boolean;
 *    margin: boolean;
 *    swap: boolean;
 *    future: boolean;
 *    option: boolean;
 *    contract: boolean;
 *    settle: Str;
 *    settleId: Str;
 *    contractSize: Num;
 *    linear: Bool;
 *    inverse: Bool;
 *    quanto?: boolean;
 *    expiry: Int;
 *    expiryDatetime: Str;
 *    strike: Num;
 *    optionType: Str;
 *    taker?: Num;
 *    maker?: Num;
 *    percentage?: Bool;
 *    tierBased?: Bool;
 *    feeSide?: Str;
 *    precision: {
 *        amount: Num;
 *        price: Num;
 *        cost?: Num;
 *    };
 *    marginModes?: MarketMarginModes;
 *    limits: {
 *        amount?: MinMax;
 *        cost?: MinMax;
 *        leverage?: MinMax;
 *        price?: MinMax;
 *        market?: MinMax;
 *    };
 *    created: Int;
 *    info: any;
 * }
 */
export async function get(exchangeId: string, symbol: string) {
    try {
        // Load markets and fetch ticker
        const exchange = getPublicExchange(exchangeId);
        const markets = await exchange.loadMarkets();
        const marketData = markets[symbol];
        if (!marketData) {
            throw new Error(`Market ${symbol} not found on ${exchangeId}`);
        }

        console.log(chalk.cyan(`Market info for ${symbol} on ${exchangeId.toUpperCase()}:`));
        console.log(JSON.stringify(marketData, null, 2));
    } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message || error}`));
    }
}
