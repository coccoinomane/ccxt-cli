import chalk from 'chalk';
import Table from 'cli-table3';
import { Order } from 'ccxt';
import { formatDate } from './dateFormatter';

/**
 * Format open orders into a readable table
 */
export function formatOpenOrders(orders: Order[]): string {
  if (orders.length === 0) {
    return 'No open orders found.';
  }

  const table = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.cyan('Time (UTC)'),
      chalk.cyan('Symbol'),
      chalk.cyan('Type'),
      chalk.cyan('Side'),
      chalk.cyan('Price'),
      chalk.cyan('Trigger'),
      chalk.cyan('Amount'),
      chalk.cyan('Filled'),
      chalk.cyan('Status')
    ],
  });

  orders.forEach((order: Order) => {
    const id = order.id || 'N/A';
    const timestamp = order.timestamp ? formatDate(order.timestamp) : 'N/A';
    const symbol = order.symbol || 'N/A';
    const type = order.type || 'N/A';
    const side = order.side || 'N/A';
    const price = order.price !== undefined ? order.price.toString() : 'N/A';
    const triggerPrice = order.triggerPrice !== undefined ? order.triggerPrice.toString() : 'N/A';
    const amount = order.amount !== undefined ? order.amount.toString() : 'N/A';
    const filled = order.filled !== undefined ? order.filled.toString() : 'N/A';
    const status = order.status || 'N/A'; // Should typically be 'open'

    table.push([
      id,
      timestamp,
      symbol,
      type,
      side,
      price,
      triggerPrice,
      amount,
      filled,
      status
    ]);
  });

  return table.toString();
}
