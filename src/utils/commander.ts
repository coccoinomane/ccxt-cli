import { Command } from 'commander';

/**
 * Parse custom parameters from process.argv
 * Looks for flags starting with --params- and converts them into a nested
 * object with automatic type conversion for numeric values
 */
export function parseCustomParams(): object {
    const params: Record<string, any> = {};
    const args = process.argv;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith('--params-')) {
            // Get the parameter path and value
            const paramKey = arg.substring(9); // Remove '--params-' prefix
            const paramValue =
                i + 1 < args.length && !args[i + 1].startsWith('--')
                    ? args[++i] // Get the next argument and increment i
                    : true; // If no value provided, treat as boolean flag

            // Split the key by - to create nested structure
            const paramPath = paramKey.split('-');
            let current = params;

            // Build nested object structure
            for (let j = 0; j < paramPath.length - 1; j++) {
                if (!current[paramPath[j]]) {
                    current[paramPath[j]] = {};
                }
                current = current[paramPath[j]];
            }

            // Set the value at the leaf, converting to number if it looks like one
            const lastKey = paramPath[paramPath.length - 1];

            // If value is a string that can be parsed as a number
            if (typeof paramValue === 'string' && !isNaN(Number(paramValue)) && paramValue.trim() !== '') {
                current[lastKey] = parseFloat(paramValue);
            } else {
                current[lastKey] = paramValue;
            }
        }
    }

    return params;
}

/**
 * Given a commander command, return all supported options,
 * taking into account the options of the command and of
 * all of its ancestors.
 */
export function getSupportedOptions(command: Command): string[] {
    const options: string[] = [];
    let currentCommand: Command | null = command;

    while (currentCommand) {
        // Extract both short and long flags from each option
        currentCommand.options.forEach((option) => {
            const flags = option.flags
                .split(/[, ]+/) // Split on commas or spaces
                .filter((flag) => flag.startsWith('-'));
            options.push(...flags);
        });

        currentCommand = currentCommand.parent;
    }

    return options;
}
