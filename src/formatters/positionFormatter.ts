import { Position } from 'ccxt';
import chalk from 'chalk';
import Table from 'cli-table3';
import { formatDate } from './dateFormatter';

/**
 * A stringified position object
 */
interface StringPosition {
    id: string;
    timestamp: string;
    symbol: string;
    side: string;
    contracts: string;
    contractSize: string;
    entryPrice: string;
    markPrice: string;
    unrealizedPnl: string;
    notional: string;
    initialMargin: string;
    collateral: string;
    marginMode: string;
    leverage: string;
    liquidationPrice: string;
    percentage: string;
}

/**
 * Format a position into a readable string
 */
export function formatPosition(position: Position, prefix: string = ''): string {
    const {
        id,
        timestamp,
        symbol,
        side,
        contracts,
        contractSize,
        entryPrice,
        markPrice,
        unrealizedPnl,
        notional,
        initialMargin,
        collateral,
        marginMode,
        leverage,
        liquidationPrice,
        percentage,
    } = stringifyPosition(position);

    const rows = [
        `${prefix}ID: ${id}`,
        `${prefix}Time: ${timestamp}`,
        `${prefix}Symbol: ${symbol}`,
        `${prefix}Side: ${side}`,
        `${prefix}Contracts: ${contracts}`,
        `${prefix}Contract Size: ${contractSize}`,
        `${prefix}Entry Price: ${entryPrice}`,
        `${prefix}Mark Price: ${markPrice}`,
        `${prefix}Unrealized PnL: ${unrealizedPnl}`,
        `${prefix}Notional: ${notional}`,
        `${prefix}Initial Margin: ${initialMargin}`,
        `${prefix}Collateral: ${collateral}`,
        `${prefix}Margin Mode: ${marginMode}`,
        `${prefix}Leverage: ${leverage}`,
        `${prefix}Liquidation Price: ${liquidationPrice}`,
        `${prefix}Percentage: ${percentage}`,
    ];

    return rows.join('\n');
}

/**
 * Format open positions into a readable table
 */
export function formatOpenPositions(positions: Position[]): string {
    if (positions.length === 0) {
        return 'No open positions found.';
    }

    const table = new Table({
        head: [
            chalk.cyan('Symbol'),
            chalk.cyan('Side'),
            chalk.cyan('Contracts'),
            chalk.cyan('Entry'),
            chalk.cyan('Mark'),
            chalk.cyan('PnL'),
            chalk.cyan('Notional'),
            chalk.cyan('Margin'),
            chalk.cyan('Mode'),
            chalk.cyan('Liq. Price'),
        ],
    });

    positions.forEach((position: Position) => {
        const { symbol, side, contracts, entryPrice, markPrice, unrealizedPnl, notional, initialMargin, marginMode, liquidationPrice } = stringifyPosition(position);

        table.push([symbol, side, contracts, entryPrice, markPrice, unrealizedPnl, notional, initialMargin, marginMode, liquidationPrice]);
    });

    return table.toString();
}

/**
 * Prepare a position for display in console.
 *
 * This is a raw position object from CCXT:
 * [
 *  {
 *    info: { ...},
 *    id: undefined,
 *    symbol: 'BTC/USDT:USDT',
 *    contracts: 0.05,
 *    contractSize: 1,
 *    unrealizedPnl: 0.445,
 *    leverage: undefined,
 *    liquidationPrice: undefined,
 *    collateral: 4805.85,
 *    notional: 4806.295,
 *    markPrice: 96125.9,
 *    entryPrice: 96117,
 *    timestamp: 1746298104913,
 *    initialMargin: 475.31475,
 *    initialMarginPercentage: 0.09889421,
 *    maintenanceMargin: 19.22518,
 *    maintenanceMarginPercentage: 0.004,
 *    marginRatio: 0.004,
 *    datetime: '2025-05-03T18:48:24.913Z',
 *    marginMode: 'cross',
 *    marginType: 'cross',
 *    side: 'long',
 *    hedged: false,
 *    percentage: 0.09,
 *    stopLossPrice: undefined,
 *    takeProfitPrice: undefined
 *  }
 * ]
 */
function stringifyPosition(position: Position): StringPosition {
    return {
        id: position.id?.toString() || 'N/A',
        timestamp: position.timestamp ? formatDate(position.timestamp) : 'N/A',
        symbol: position.symbol || 'N/A',
        side: position.side || 'N/A',
        contracts: position.contracts !== undefined ? position.contracts.toString() : 'N/A',
        contractSize: position.contractSize !== undefined ? position.contractSize.toString() : 'N/A',
        entryPrice: position.entryPrice !== undefined ? position.entryPrice.toString() : 'N/A',
        markPrice: position.markPrice !== undefined ? position.markPrice.toString() : 'N/A',
        unrealizedPnl: position.unrealizedPnl !== undefined ? position.unrealizedPnl.toString() : 'N/A',
        notional: position.notional !== undefined ? position.notional.toString() : 'N/A',
        initialMargin: position.initialMargin !== undefined ? position.initialMargin.toString() : 'N/A',
        collateral: position.collateral !== undefined ? position.collateral.toString() : 'N/A',
        marginMode: position.marginMode || 'N/A',
        leverage: position.leverage !== undefined ? position.leverage.toString() : 'N/A',
        liquidationPrice: position.liquidationPrice !== undefined ? position.liquidationPrice.toString() : 'N/A',
        percentage: position.percentage !== undefined ? position.percentage.toString() + '%' : 'N/A',
    };
}
