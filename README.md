# CCXT CLI

A command-line interface for the [CCXT](https://github.com/ccxt/ccxt) cryptocurrency trading library.

## Features

- Check your balance on multiple CEXs
- Place market and limit orders on multiple CEXs
- Human-readable output for commands
- Confirmation prompts for potentially destructive actions
- Clear warnings about exchange requirements (e.g., address whitelisting)
- Secure storage of API keys for exchanges

## Usage

1. Clone the repository: `git clone https://github.com/coccoinomane/ccxt-cli.git`
2. Install dependencies: `npm install`
3. Run the CLI with `npm run ccxt-cli -- <args>`

## Available Commands

### Market Data (no API keys required)

```bash
# Fetch all active markets supported by an exchange
npm run ccxt-cli -- market markets binance

# Fetch all active currencies supported by an exchange
npm run ccxt-cli -- market currencies binance

# Fetch ticker info for a specific market
npm run ccxt-cli -- market ticker binance BTC/USDT
```

### Set up your API keys

```bash
# Add an exchange
npm run ccxt-cli -- config add binance

# List configured exchanges
npm run ccxt-cli -- config list
```

### Account Operations

```bash
# Check your balance
npm run ccxt-cli -- account balance binance

# Withdraw funds (will prompt for confirmation)
npm run ccxt-cli -- account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
# Use --force to skip confirmation
npm run ccxt-cli -- account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa --force
```

### Trading

```bash
# Create a limit buy order
npm run ccxt-cli -- order create binance BTC/USDT --side buy --amount 0.001 --price 50000

# Create a market sell order
npm run ccxt-cli -- order create binance BTC/USDT --type market --side sell --amount 0.001
```

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
