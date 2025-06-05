# CCXT CLI

A command-line interface for the [CCXT](https://github.com/ccxt/ccxt) cryptocurrency trading library.

## Features

- Support for most CEXs
- Check your balance
- Place market and limit orders
- Human-readable output for commands
- Confirmation prompts for potentially destructive actions
- Clear warnings about exchange requirements (e.g., address whitelisting)
- Secure storage of API keys for exchanges
- Testnet/sandbox support

## Quick Start

1. `git clone https://github.com/coccoinomane/ccxt-cli.git`
2. `cd ccxt-cli`
3. `npm install`
4. `npm link`
5. Run the CLI with `ccxt-cli <args>`

## Set up your API keys

```bash
# Add an exchange
npm run ccxt-cli -- config add binance
npm run ccxt-cli -- config add cryptocom

# To add an exchange testnet/sandbox, use the `-testnet` suffix
npm run ccxt-cli -- config add binance-testnet
npm run ccxt-cli -- config add cryptocom-testnet

# Show all configured exchanges
npm run ccxt-cli -- config list
```

## Development

To see the changes you make to the code take effect, you can either:

- build and run the CLI with `npm run build && ccxt-cli <args>`, or
- run the shorthand command `npm run ccxt-cli -- <args>`.

## Global options

- `--debug-calls`: Print to the console most of the calls made to the API and their response.
- `--debug-calls-verbose`: Print to the console all of the calls made to the API and their response.
- `--debug-http`: Print to the console all HTTP requests and responses to the exchange APIs.

## Available Commands

### Supported exchanges and functions

```bash
# List all exchanges supported by CCXT
npm run ccxt-cli -- exchanges list

# List features supported by an exchange
npm run ccxt-cli -- exchanges features binance

# List functions supported by an exchange
npm run ccxt-cli -- exchanges supported binance

# List functions NOT supported by an exchange
npm run ccxt-cli -- exchanges unsupported binance
```

### Market Data (no API keys required)

```bash
# Fetch all active markets supported by an exchange
npm run ccxt-cli -- market list binance

# Fetch details and limits about a specific market
npm run ccxt-cli -- market get binance BTC/USDT

# Fetch price and volume info for a specific market
npm run ccxt-cli -- market ticker binance BTC/USDT

# Fetch all active currencies supported by an exchange
npm run ccxt-cli -- market currencies binance
```

### Account Operations

```bash
# Check your spot balance
npm run ccxt-cli -- account balance binance

# Transfer funds between different accounts, e.g. from spot to future
npm run ccxt-cli -- account transfer binance --currency USDC --amount 100 --from spot --to future

# Withdraw funds (will prompt for confirmation)
npm run ccxt-cli -- account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
# Use --force to skip confirmation
npm run ccxt-cli -- account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa --force
```

### Trading and placing orders

Create a limit buy order:

```bash
npm run ccxt-cli -- order create binance BTC/USDT --type limit --side buy --amount 0.001 --price 50000
```

Create a market sell order:

```bash
npm run ccxt-cli -- order create binance BTC/USDT --type market --side sell --amount 0.001
```

Create a stop order:

```bash
npm run ccxt-cli -- order create binance BTC/USDT --type market --side sell --amount 0.001 --params-triggerPrice 52000
```

Create an OCO order to:

1. buy BTC at 50000, then
2. set a stop loss at 48000 (triggering at 48100) and
3. a take profit at 52000 (triggering at 51900):

```bash
npm run ccxt-cli -- order create binance BTC/USDT\
 --type limit --side buy --amount 0.001 --price 50000\
 --params-stopLoss-triggerPrice   48000 --params-stopLoss-price 47900\
 --params-takeProfit-triggerPrice 52000 --params-takeProfit-price 51900
```

### Testnet/sandbox

Same as above, but for testnet/sandbox use the `-testnet` suffix. For example, for spot Binance testnet, you can do:

```bash
npm run ccxt-cli -- config add binance-testnet
npm run ccxt-cli -- order create binance-testnet BTC/USDT --type limit --side buy --amount 0.001 --price 100000
```

For futures testnet, you can do:

```bash
npm run ccxt-cli -- config add binanceusdm-testnet
npm run ccxt-cli -- order create binanceusdm-testnet BTC/USDT:USDT --type limit --side buy --amount 0.01 --price 100000
```

Usually the API keys for testnet/sandbox are not the same as the ones for the mainnet/live environment. For example, on Binance, you need to create them here:

- For spot orders > https://testnet.binance.vision/
- For futures orders > https://testnet.binancefuture.com/

### Managing orders

Get details about a specific order:

```bash
npm run ccxt-cli -- order get binance 1234567890 --symbol BTC/USDT
```

Cancel a specific order:

```bash
npm run ccxt-cli -- order cancel binance 1234567890 --symbol BTC/USDT
# The market symbol may be omitted on some exchanges
npm run ccxt-cli -- order cancel cryptocom 1234567890
```

Cancel all open orders on a market:

```bash
npm run ccxt-cli -- order cancelAll binance --symbol BTC/USDT
```

#### Using Custom Parameters

The `order create` command supports passing custom parameters to the underlying exchange API using the `--params-*` syntax. These parameters are passed directly to the CCXT `createOrder` function as the `params` object.

Example of custom parameters object that will be created:

```javascript
const params = {
    stopLoss: {
        triggerPrice: 6.0,
        price: 5.0,
    },
    takeProfit: {
        triggerPrice: 15.0,
        price: 14.0,
    },
};
```

You can specify these parameters on the command line using dot notation:

```bash
--params-stopLoss-triggerPrice 6.0 --params-stopLoss-price 5.0 --params-takeProfit-triggerPrice 15.0 --params-takeProfit-price 14.0
```

Note that the available parameters depend on the specific exchange API and may vary; for more details, refer to the [CCXT documentation on placing orders](https://docs.ccxt.com/#/README?id=placing-orders).

## Environment Variables (TO DO)

You can also set your API keys as environment variables:

```bash
export BINANCE_APIKEY=your_api_key
export BINANCE_SECRET=your_secret_key
```

## Security Notes

- API keys are stored encrypted, but for maximum security, consider using environment variables for sensitive operations.
- Always verify deposit addresses before executing withdrawals.
- Some exchanges require address whitelisting on their website before withdrawal.
