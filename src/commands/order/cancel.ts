import chalk from 'chalk';
import { getAuthenticatedExchange } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';
import { formatOrder } from '../../formatters/orderFormatter';

interface CancelOrderOptions {
  symbol?: string;
  force?: boolean;
}

/**
 * Command to cancel an order on an exchange
 */
export async function cancel(
  exchangeId: string,
  orderId: string,
  options: CancelOrderOptions
) {
  try {
    const exchange = getAuthenticatedExchange(exchangeId);
    
    const { symbol, force } = options;

    if (!exchange.has['cancelOrder']) {
      console.error(chalk.red('Error: The exchange does not support canceling orders.'));
      return;
    }

    if (!force) {
      const order = await exchange.fetchOrder(orderId, symbol);
      const formattedOrder = formatOrder(order);
      console.log(formattedOrder);
      const confirmed = await confirmAction(
        `Are you sure you want to cancel the above order?`,
        force
      );
      if (!confirmed) {
        console.log(`Order cancellation cancelled.`);
        return;
      }  
    }
    
    // Cancel order
    const cancelledOrder = await exchange.cancelOrder(orderId, symbol);
    console.log(cancelledOrder);
    
    console.log(chalk.green(`Order ${orderId} cancelled.`));
    
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message || error}`));
  }
} 