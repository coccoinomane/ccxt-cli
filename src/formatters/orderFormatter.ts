import chalk from 'chalk';
import Table from 'cli-table3';
import { Order } from 'ccxt';
import { formatDate } from './dateFormatter';

/**
 * A stringified order object
 */
interface StringOrder {
    id: string;
    timestamp: string;
    symbol: string;
    type: string;
    side: string;
    price: string;
    triggerPrice: string;
    amount: string;
    filled: string;
    status: string;
}

/**
 * Format an order into a readable table
 */
export function formatOrder(order: Order, prefix: string = ''): string {
    const { id, timestamp, symbol, type, side, price, triggerPrice, amount, filled, status } = stringifyOrder(order);
    const rows = [
        `${prefix}ID: ${id}`,
        `${prefix}Time: ${timestamp}`,
        `${prefix}Symbol: ${symbol}`,
        `${prefix}Type: ${type}`,
        `${prefix}Side: ${side}`,
        `${prefix}Price: ${price}`,
        `${prefix}Trigger price: ${triggerPrice}`,
        `${prefix}Amount: ${amount}`,
        `${prefix}Filled: ${filled}`,
        `${prefix}Status: ${status}`,
    ];
    return rows.join('\n');
}

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
            chalk.cyan('Status'),
        ],
    });

    orders.forEach((order: Order) => {
        const { id, timestamp, symbol, type, side, price, triggerPrice, amount, filled, status } = stringifyOrder(order);

        table.push([id, timestamp, symbol, type, side, price, triggerPrice, amount, filled, status]);
    });

    return table.toString();
}

/**
 * Prepare an order for display in console
 */
function stringifyOrder(order: Order): StringOrder {
    return {
        id: order.id || 'N/A',
        timestamp: order.timestamp ? formatDate(order.timestamp) : 'N/A',
        symbol: order.symbol || 'N/A',
        type: order.type || 'N/A',
        side: order.side || 'N/A',
        price: order.price !== undefined ? order.price.toString() : 'N/A',
        triggerPrice: order.triggerPrice !== undefined ? order.triggerPrice.toString() : 'N/A',
        amount: order.amount !== undefined ? order.amount.toString() : 'N/A',
        filled: order.filled !== undefined ? order.filled.toString() : 'N/A',
        status: order.status || 'N/A',
    };
}
