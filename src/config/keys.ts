import Conf from 'conf';
import { prompt } from 'inquirer';
import { isExchangeSupported } from '../utils/exchange';

const config = new Conf({
  encryptionKey: 'ccxt-cli-encryption-key', // Consider more secure approaches
  projectName: 'ccxt-cli'
});

/**
 * Add API keys for an exchange
 */
export async function addExchangeConfig(exchangeId: string) {
  if (!isExchangeSupported(exchangeId)) {
    throw new Error(`Exchange ${exchangeId} is not supported by CCXT.`);
  }

  const { apiKey, secret } = await prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: `Enter API key for ${exchangeId.toLowerCase()}:`
    },
    {
      type: 'password',
      name: 'secret',
      message: `Enter secret for ${exchangeId.toLowerCase()}:`
    }
  ]);

  config.set(`exchanges.${exchangeId.toLowerCase()}`, { apiKey, secret });
  console.log(`Credentials for ${exchangeId.toLowerCase()} saved successfully`);
}

/**
 * Get API keys for an exchange
 */
export function getExchangeConfig(exchangeId: string) {
  return config.get(`exchanges.${exchangeId.toLowerCase()}`);
}

/**
 * List all exchanges with configured API keys
 */
export function listExchanges() {
  const exchanges = config.get('exchanges') as Record<string, any> || {};
  return Object.keys(exchanges);
}

/**
 * Delete API keys for an exchange
 */
export function deleteExchangeConfig(exchangeId: string) {
  if (config.has(`exchanges.${exchangeId.toLowerCase()}`)) {
    config.delete(`exchanges.${exchangeId.toLowerCase()}`);
    console.log(`Credentials for ${exchangeId.toLowerCase()} deleted successfully`);
    return true;
  } else {
    console.log(`No credentials found for ${exchangeId.toLowerCase()}`);
    return false;
  }
} 