import chalk from 'chalk';
import { getExchangeWithAPI } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';

interface CreateOrderOptions {
  type?: string;
  side?: string;
  amount: string;
  price?: string;
  force?: boolean;
}

/**
 * Command to create a new order on an exchange
 */
export async function create(
  exchangeId: string,
  symbol: string,
  options: CreateOrderOptions
) {
  try {
    const exchange = getExchangeWithAPI(exchangeId);
    
    const { type = 'limit', side = 'buy', amount, price, force } = options;
    
    // For market orders, make sure user understands price is not specified
    if (type === 'market' && !force) {
      console.log(chalk.yellow('Warning: Market orders execute at the current market price, which may differ from what you expect.'));
    }
    
    // Confirm order creation
    let orderDesc = `${side} ${amount} ${symbol}`;
    if (type === 'limit' && price) {
      orderDesc += ` @ ${price} (limit order)`;
    } else {
      orderDesc += ` at market price (market order)`;
    }
    
    const confirmed = await confirmAction(
      `Are you sure you want to ${orderDesc}?`,
      force
    );
    
    if (!confirmed) {
      console.log('Order cancelled.');
      return;
    }
    
    // Create order
    const order = await exchange.createOrder(
      symbol,
      type,
      side,
      parseFloat(amount),
      type === 'limit' && price ? parseFloat(price) : undefined
    );
    
    console.log(chalk.green('Order created:'));
    console.log(JSON.stringify(order, null, 2));
    
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message || error}`));
  }
} 