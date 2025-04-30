import chalk from 'chalk';

type DebugCalls = false | 'most' | 'all';

// Global flag that can be set from CLI
let debugCalls: DebugCalls;

/**
 * Set the debug mode for CCXT function calls
 */
export function setDebugCalls(debug: boolean, debugVerbose: boolean): void {
    debugCalls = false;
    if (debug) {
        debugCalls = 'most';
    }
    if (debugVerbose) {
        debugCalls = 'all';
    }
}

/**
 * Get the current debug mode status
 */
export function getDebugCalls(): DebugCalls {
    return debugCalls;
}

/**
 * Wrap an exchange function call with debug logging
 * @param fn The exchange function to call
 * @param args Arguments to pass to the function
 * @returns The result of the function call
 */
export async function debugFunctionCall<T>(methodName: string, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    try {
        const result = await fn(...args);

        if (debugCalls) {
            console.log(chalk.gray('--------- Function Response ---------'));
            console.log(chalk.gray(`Method: ${methodName}`));
            console.log(chalk.gray('Result:'));
            console.log(JSON.stringify(result, null, 2));
            console.log(chalk.gray('-------------------------------'));
        }

        return result;
    } catch (error) {
        // Still log errors even when debugging
        if (debugCalls) {
            console.log(chalk.red('--------- Function Error ---------'));
            console.log(chalk.red(`Method: ${methodName}`));
            console.log(chalk.red('Error:'));
            console.log(error);
            console.log(chalk.red('-----------------------------'));
        }
        throw error;
    }
}
