#!/usr/bin/env node
import { Command } from 'commander';
import { setDebugCalls, setDebugHttp } from './utils/debug';

// Import commands
import { add as configAdd } from './commands/config/add';
import { list as configList } from './commands/config/list';
import { balance as accountBalance } from './commands/account/balance';
import { transfer as accountTransfer } from './commands/account/transfer';
import { currencies as marketCurrencies } from './commands/market/currencies';
import { markets as marketMarkets } from './commands/market/markets';
import { ticker as marketTicker } from './commands/market/ticker';
import { withdraw as accountWithdraw } from './commands/account/withdraw';
import { create as orderCreate } from './commands/order/create';
import { get as orderGet } from './commands/order/get';
import { cancel as orderCancel } from './commands/order/cancel';
import { cancelAll as orderCancelAll } from './commands/order/cancelAll';
import { open as orderListOpen } from './commands/order/list/open';
import { list as exchangesList } from './commands/exchanges/list';
import { features as exchangesFeatures } from './commands/exchanges/features';
import { supported as exchangesSupported } from './commands/exchanges/supported';
import { unsupported as exchangesUnsupported } from './commands/exchanges/unsupported';
import { accountTypes as exchangesAccountTypes } from './commands/exchanges/accountTypes';
import { getSupportedOptions } from './utils/commander';

// Initialize commander
const program = new Command();

program
    .name('ccxt-cli')
    .description('CLI for cryptocurrency exchange trading via CCXT')
    .version('1.0.0')
    .hook('preAction', (cmd) => {
        // Set global flags
        const options = cmd.opts();
        // Debug calls
        const debugCalls = options.debugCalls || false;
        const debugCallsVerbose = options.debugCallsVerbose || false;
        setDebugCalls(debugCalls, debugCallsVerbose);
        // Debug HTTP
        const debugHttp = options.debugHttp || false;
        setDebugHttp(debugHttp);
    });

// Add global options
program.option('--debug-http', 'Print all HTTP requests and responses to the exchange APIs');
program.option('--debug-calls', 'Print most CCXT function calls and responses');
program.option('--debug-calls-verbose', 'Print all CCXT function calls and responses');

// Configuration commands
const configCommand = program.command('config').description('Manage exchange API keys');

configCommand
    .command('add')
    .description('Add API keys for an exchange')
    .argument('<exchange>', 'Exchange ID (e.g., binance, kraken).  Use the `-testnet` suffix for sandbox environments, e.g. `binance-testnet`.')
    .action(configAdd);

configCommand.command('list').description('List configured exchanges').action(configList);

// Market commands
const marketCommand = program.command('market').description('Get market data');

marketCommand
    .command('ticker')
    .description('Get ticker information')
    .argument('<exchange>', 'Exchange ID')
    .argument('<symbol>', 'Trading pair symbol (e.g., BTC/USDT)')
    .action(marketTicker);

marketCommand.command('currencies').description('Get active currencies supported by an exchange').argument('<exchange>', 'Exchange ID').action(marketCurrencies);

marketCommand.command('markets').description('Get active markets supported by an exchange').argument('<exchange>', 'Exchange ID').action(marketMarkets);

// Account commands
const accountCommand = program.command('account').description('Account operations');

accountCommand.command('balance').description('Get account balance').argument('<exchange>', 'Exchange ID').action(accountBalance);

accountCommand
    .command('transfer')
    .description('Transfer funds between accounts, e.g. from spot to future')
    .argument('<exchange>', 'Exchange ID')
    .requiredOption('--currency <currency>', 'Currency code')
    .requiredOption('--amount <amount>', 'Amount to transfer')
    .requiredOption('--from <from>', 'From account')
    .requiredOption('--to <to>', 'To account')
    .option('-f, --force', 'Skip confirmation prompt', false)
    .action((exchange, options) => accountTransfer(exchange, options));

accountCommand
    .command('withdraw')
    .description('Withdraw funds')
    .argument('<exchange>', 'Exchange ID')
    .argument('<currency>', 'Currency code')
    .argument('<amount>', 'Amount to withdraw')
    .argument('<address>', 'Destination address')
    .option('-t, --tag <tag>', 'Tag/memo for currencies that require it')
    .option('-f, --force', 'Skip confirmation prompt', false)
    .action((exchange, currency, amount, address, options) => accountWithdraw(exchange, currency, amount, address, options));

// Order commands
const orderCommand = program.command('order').description('Trade on exchanges');

orderCommand
    .command('get')
    .description('Get an order')
    .argument('<exchange>', 'Exchange ID')
    .argument('<orderId>', 'Order ID')
    .option('--symbol <symbol>', 'Trading pair symbol, required for some exchanges including Binance')
    .action((exchange, orderId, options) => orderGet(exchange, orderId, options));

orderCommand
    .command('cancel')
    .description('Cancel an order')
    .argument('<exchange>', 'Exchange ID')
    .argument('<orderId>', 'Order ID')
    .option('--symbol <symbol>', 'Trading pair symbol, required for some exchanges including Binance')
    .option('-f, --force', 'Skip confirmation prompt', false)
    .action((exchange, orderId, options) => orderCancel(exchange, orderId, options));

orderCommand
    .command('cancelAll')
    .description('Cancel all open orders on the given market')
    .argument('<exchange>', 'Exchange ID')
    .option('--symbol <symbol>', 'Trading pair symbol, required for some exchanges including Binance')
    .option('-f, --force', 'Skip confirmation prompt', false)
    .action((exchange, options) => orderCancelAll(exchange, options));

orderCommand
    .command('create')
    .description('Create a new order; supports custom parameters via the --params-<key> <value> syntax')
    .argument('<exchange>', 'Exchange ID')
    .argument('<symbol>', 'Trading pair symbol')
    .requiredOption('-a, --amount <amount>', 'Order amount')
    .requiredOption('-t, --type <type>', 'Order type (limit/market)', 'limit')
    .requiredOption('-s, --side <side>', 'Order side (buy/sell)', 'buy')
    .option('-p, --price <price>', 'Order price (for limit orders)')
    .option('-f, --force', 'Skip confirmation prompt', false)
    .allowUnknownOption()
    .hook('preAction', (cmd) => {
        // Passed options that are not known by the current command
        let unknown = cmd.parseOptions(process.argv).unknown;
        // For some reason, the above includes options that are supported by
        // parent commands, so we need to exclude them manually
        unknown = unknown.filter((option) => !getSupportedOptions(cmd).includes(option));
        for (let i = 0; i < unknown.length; i++) {
            // If 'i' is even, then it's a key, and the key must start with '--params-'
            // If 'i' is odd, then it's a value, and there are no constraints
            if (i % 2 === 1) continue;
            if (!unknown[i].startsWith('--params-')) {
                cmd.error('Error: Unknown option: ' + unknown[i]);
            } else {
                // Make sure there is a value for the key
                if (unknown[i + 1] === undefined || unknown[i + 1].startsWith('-')) {
                    cmd.error('Error: Missing value for option: ' + unknown[i]);
                }
            }
        }
    })
    .action((exchange, symbol, options, command) => orderCreate(exchange, symbol, options, command));

// Add list subcommand to order
const orderListCommand = orderCommand.command('list').description('List orders');

orderListCommand.command('open').description('List open orders').argument('<exchange>', 'Exchange ID').action(orderListOpen);

// Exchanges commands
const exchangesCommand = program.command('exchanges').description('Get info about supported exchanges');

exchangesCommand.command('list').description('List all exchanges supported by CCXT').action(exchangesList);

exchangesCommand
    .command('features')
    .description('List all methods and functionalities supported by the given exchange indexed by market-type (spot, futures, swap, etc.)')
    .argument('<exchange>', 'Exchange ID')
    .action(exchangesFeatures);

exchangesCommand
    .command('supported')
    .description('List functions supported by an exchange.  Also see the `features` command.')
    .argument('<exchange>', 'Exchange ID')
    .action(exchangesSupported);

exchangesCommand.command('unsupported').description('List functions NOT supported by an exchange').argument('<exchange>', 'Exchange ID').action(exchangesUnsupported);

exchangesCommand
    .command('accountTypes')
    .description('List all account types supported by an exchange (funding, spot, future, main, etc.)')
    .argument('<exchange>', 'Exchange ID')
    .action(exchangesAccountTypes);

// Parse command line arguments
program.parse();
