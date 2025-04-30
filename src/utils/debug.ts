import chalk from 'chalk';

type DebugCalls = false | 'most' | 'all';

// Global flags that can be set from CLI
let debugCalls: DebugCalls;
let debugHttp: boolean;
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
 * Set the debug mode for HTTP requests
 */
export function setDebugHttp(debug: boolean): void {
    debugHttp = debug;
}

/**
 * Get the current debug mode status
 */
export function getDebugCalls(): DebugCalls {
    return debugCalls;
}

/**
 * Get the current debug mode status for HTTP requests
 */
export function getDebugHttp(): boolean {
    return debugHttp;
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
            console.log(chalk.gray('Args:'));
            console.log(JSON.stringify(args, null, 2));
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
