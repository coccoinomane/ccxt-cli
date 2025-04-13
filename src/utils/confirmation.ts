import { prompt } from 'inquirer';
import chalk from 'chalk';

/**
 * Request user confirmation before executing a potentially destructive action
 */
export async function confirmAction(message: string, forceFlag: boolean = false): Promise<boolean> {
  // Skip confirmation if force flag is set
  if (forceFlag) {
    return true;
  }
  
  const { confirm } = await prompt({
    type: 'confirm',
    name: 'confirm',
    message: chalk.yellow(message),
    default: false
  });
  
  return confirm;
} 