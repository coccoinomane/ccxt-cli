import { addExchangeConfig } from '../../config/keys';

/**
 * Command to add API keys for an exchange
 */
export async function add(exchangeId: string) {
    await addExchangeConfig(exchangeId);
}
