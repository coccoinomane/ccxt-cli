import chalk from 'chalk';
import { getExchange } from '../../utils/exchange';

/**
 * Command to fetch ticker information for a symbol
 */
export async function ticker(exchangeId: string, symbol: string) {
  try {
    // Load markets and fetch ticker
    const exchange = getExchange(exchangeId);
    await exchange.loadMarkets();    
    const tickerData = await exchange.fetchTicker(symbol);
    
    console.log(chalk.cyan(`Ticker for ${symbol} on ${exchangeId.toUpperCase()}:`));
    console.log(
      chalk.white(
        `Last: ${chalk.green(tickerData.last)} | ` +
        `Bid: ${chalk.green(tickerData.bid)} | ` +
        `Ask: ${chalk.red(tickerData.ask)} | ` +
        `24h High: ${tickerData.high} | ` +
        `24h Low: ${tickerData.low} | ` +
        `24h Volume: ${tickerData.baseVolume} ${symbol.split('/')[0]}`
      )
    );
    
    // Display percentage change if available
    if (tickerData.percentage) {
      const changeColor = tickerData.percentage >= 0 ? chalk.green : chalk.red;
      const changeSymbol = tickerData.percentage >= 0 ? '↑' : '↓';
      console.log(`24h Change: ${changeColor(`${changeSymbol} ${Math.abs(tickerData.percentage).toFixed(2)}%`)}`);
    }
    
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message || error}`));
  }
} 