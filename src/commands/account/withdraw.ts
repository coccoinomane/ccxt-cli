import chalk from 'chalk';
import { getAuthenticatedExchange, checkCurrencyRequirements } from '../../utils/exchange';
import { confirmAction } from '../../utils/confirmation';

interface WithdrawOptions {
  tag?: string;
  force?: boolean;
}

/**
 * Command to withdraw funds from an exchange
 */
export async function withdraw(
  exchangeId: string, 
  currency: string, 
  amount: string, 
  address: string, 
  options: WithdrawOptions = {}
) {
  try {
    const exchange = getAuthenticatedExchange(exchangeId);
    
    // Check for currency-specific requirements
    await checkCurrencyRequirements(exchange, currency, 'withdraw');
    
    // Confirm withdrawal unless --force is used
    const confirmed = await confirmAction(
      `Are you sure you want to withdraw ${amount} ${currency} to ${address}?`, 
      options.force
    );
    
    if (!confirmed) {
      console.log('Withdrawal cancelled.');
      return;
    }
    
    // Execute withdrawal
    const result = await exchange.withdraw(
      currency.toUpperCase(),
      parseFloat(amount),
      address,
      options.tag
    );
    
    console.log(chalk.green('Withdrawal initiated:'));
    console.log(result);
    
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message || error}`));
    if (error.message?.includes('requires manual approval')) {
      console.log(chalk.yellow('This action requires manual approval on the exchange website.'));
    }
  }
} 