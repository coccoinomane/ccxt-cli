import Table from 'cli-table3';
import { getExchange } from "../../utils/exchange";
import chalk from "chalk";
import { MarketInterface } from 'ccxt';

/**
 * Command to list all active markets supported by the given
 * exchange
 */
export async function markets(exchangeId: string) {
  const exchange = getExchange(exchangeId);
  const markets = await exchange.loadMarkets();
  const activeMarkets = Object.keys(markets).filter(key => markets[key]?.active);

  const table = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.cyan('Active'),
      chalk.cyan('Symbol'),
      chalk.cyan('Type'),
    ]
  });

  Object.keys(activeMarkets).forEach(key => {
    const market = markets[key] as MarketInterface;
    table.push([
      key,
      market.active,
      market.symbol,
      market.type,
    ]);
  });
  
  console.log(chalk.cyan(`Markets suported by ${exchangeId}:`));
  console.log(table.toString());
  console.log(`Number of active markets: ${Object.keys(activeMarkets).length}`);
}
