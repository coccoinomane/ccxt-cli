# CCXT CLI

A command-line interface for the [CCXT](https://github.com/ccxt/ccxt) cryptocurrency trading library.

## Features

- Check your balance on multiple CEXs
- Place market and limit orders on multiple CEXs
- Human-readable output for commands
- Confirmation prompts for potentially destructive actions
- Clear warnings about exchange requirements (e.g., address whitelisting)
- Secure storage of API keys for exchanges

## Installation

```bash
# Install globally
npm install -g cctx-cli

# Or install locally
npm install cctx-cli
```

## Usage

### Configure Exchanges

First, set up your API keys:

```bash
# Add an exchange
ccxt-cli config add binance

# List configured exchanges
ccxt-cli config list
```

### Market Data

```bash
# Fetch all active currencies supported by an exchange
ccxt-cli market currencies binance

# Fetch all active markets supported by an exchange
ccxt-cli market markets binance

# Fetch ticker info for a specific market
ccxt-cli market ticker binance BTC/USDT
```

### Account Operations

```bash
# Check your balance
ccxt-cli account balance binance

# Withdraw funds (will prompt for confirmation)
ccxt-cli account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
# Use --force to skip confirmation
ccxt-cli account withdraw binance BTC 0.01 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa --force
```

### Trading

```bash
# Create a limit buy order
ccxt-cli order create binance BTC/USDT --side buy --amount 0.001 --price 50000

# Create a market sell order
ccxt-cli order create binance BTC/USDT --type market --side sell --amount 0.001
```

### List Supported Exchanges

```bash
ccxt-cli exchanges
```

## Environment Variables

You can also set your API keys as environment variables:

```bash
export BINANCE_APIKEY=your_api_key
export BINANCE_SECRET=your_secret_key
```

## Security Notes

- API keys are stored encrypted, but for maximum security, consider using environment variables for sensitive operations.
- Always verify deposit addresses before executing withdrawals.
- Some exchanges require address whitelisting on their website before withdrawal.
