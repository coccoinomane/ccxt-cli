import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';
import { formatOrder } from '../../formatters/orderFormatter';

interface GetOrderOptions {
  symbol?: string;
}

/**
 * Command to get an order on an exchange by its ID
 */
export async function get(
  exchangeId: string,
  orderId: string,
  options: GetOrderOptions
) {
  try {
    const exchange = getAuthenticatedExchange(exchangeId);

    const { symbol } = options;
    
    if (!exchange.has['fetchOrder']) {
      console.error(chalk.red('Error: The exchange does not support fetching orders.'));
      return;
    }

    const order = await exchange.fetchOrder(orderId, symbol);
    const formattedOrder = formatOrder(order);

    console.log(chalk.green('Order:'));
    console.log(formattedOrder);
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message || error}`));
  }
} 