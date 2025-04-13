import Table from 'cli-table3';
import { getExchange } from "../../utils/exchange";
import chalk from "chalk";

/**
 * Command to list all currencies supported by the
 * given exchange
 */
export async function currencies(exchangeId: string) {
  const exchange = getExchange(exchangeId);
  await exchange.loadMarkets();
  
  const table = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.cyan('Code'),
      chalk.cyan('Precision'),
      chalk.cyan('Name'),
      chalk.cyan('Deposit'),
      chalk.cyan('Withdraw'),
      chalk.cyan('Networks')
    ]
  });
  
  Object.keys(exchange.currencies).forEach(key => {
    const currency = exchange.currencies[key];
    table.push([
      key,
      currency.code,
      currency.precision,
      currency.name,
      currency.deposit,
      currency.withdraw,
      Object.keys(currency.networks).join(', ')
    ]);
  });
  
  console.log(chalk.cyan(`Currencies suported by ${exchangeId}:`));
  console.log(table.toString());
  console.log(`Number of active currencies: ${Object.keys(exchange.currencies).length}`);
}
