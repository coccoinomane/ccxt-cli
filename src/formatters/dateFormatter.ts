/**
 * Format a timestamp in YYYY-MM-DD HH:MM:SS format,
 * in UTC timezone.
 */
export function formatDate(timestamp: number) {
    return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19);
}
