#!/usr/bin/env node
import { Command } from 'commander';

// Import commands
import { add as configAdd } from './commands/config/add';
import { list as configList } from './commands/config/list';
import { balance as accountBalance } from './commands/account/balance';
import { currencies as marketCurrencies } from './commands/market/currencies';
import { markets as marketMarkets } from './commands/market/markets';
import { ticker as marketTicker } from './commands/market/ticker';
import { withdraw as accountWithdraw } from './commands/account/withdraw';
import { create as orderCreate } from './commands/order/create';
import { exchanges } from './commands/exchanges';

// Initialize commander
const program = new Command();

program
  .name('ccxt-cli')
  .description('CLI for cryptocurrency exchange trading via CCXT')
  .version('1.0.0');

// Add global options
program.option('-v, --verbose', 'Enable verbose output');

// Configuration commands
const configCommand = program
  .command('config')
  .description('Manage exchange API keys');

configCommand
  .command('add')
  .description('Add API keys for an exchange')
  .argument('<exchange>', 'Exchange ID (e.g., binance, kraken)')
  .action(configAdd);

configCommand
  .command('list')
  .description('List configured exchanges')
  .action(configList);

// Market commands
const marketCommand = program
  .command('market')
  .description('Get market data');

marketCommand
  .command('ticker')
  .description('Get ticker information')
  .argument('<exchange>', 'Exchange ID')
  .argument('<symbol>', 'Trading pair symbol (e.g., BTC/USDT)')
  .action(marketTicker);

marketCommand
  .command('currencies')
  .description('Get active currencies supported by an exchange')
  .argument('<exchange>', 'Exchange ID')
  .action(marketCurrencies);

marketCommand
  .command('markets')
  .description('Get active markets supported by an exchange')
  .argument('<exchange>', 'Exchange ID')
  .action(marketMarkets);

// Account commands
const accountCommand = program
  .command('account')
  .description('Account operations');

accountCommand
  .command('balance')
  .description('Get account balance')
  .argument('<exchange>', 'Exchange ID')
  .action(accountBalance);

accountCommand
  .command('withdraw')
  .description('Withdraw funds')
  .argument('<exchange>', 'Exchange ID')
  .argument('<currency>', 'Currency code')
  .argument('<amount>', 'Amount to withdraw')
  .argument('<address>', 'Destination address')
  .option('-t, --tag <tag>', 'Tag/memo for currencies that require it')
  .option('-f, --force', 'Skip confirmation prompt', false)
  .action((exchange, currency, amount, address, options) => 
    accountWithdraw(exchange, currency, amount, address, options));

// Order commands
const orderCommand = program
  .command('order')
  .description('Trade on exchanges');

orderCommand
  .command('create')
  .description('Create a new order')
  .argument('<exchange>', 'Exchange ID')
  .argument('<symbol>', 'Trading pair symbol')
  .option('-t, --type <type>', 'Order type (limit/market)', 'limit')
  .option('-s, --side <side>', 'Order side (buy/sell)', 'buy')
  .option('-a, --amount <amount>', 'Order amount')
  .option('-p, --price <price>', 'Order price (for limit orders)')
  .option('-f, --force', 'Skip confirmation prompt', false)
  .action((exchange, symbol, options) => orderCreate(exchange, symbol, options));

program
  .command('exchanges')
  .description('List all exchanges supported by CCXT')
  .action(exchanges);
  
// Parse command line arguments
program.parse(); 