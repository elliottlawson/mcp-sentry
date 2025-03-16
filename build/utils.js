import { SentryError } from './models.js';
/**
 * Extracts a Sentry issue ID from a URL or standalone ID
 *
 * @param issueIdOrUrl - The Sentry issue ID or URL
 * @returns The extracted issue ID
 * @throws SentryError if the issue ID or URL is invalid
 */
export function extractIssueId(issueIdOrUrl) {
    if (!issueIdOrUrl) {
        throw new SentryError('Missing issue_id_or_url argument');
    }
    // Check if it's a URL
    if (issueIdOrUrl.startsWith('http')) {
        try {
            const url = new URL(issueIdOrUrl);
            const pathParts = url.pathname.split('/');
            // Find the issue ID in the path
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i] === 'issues' && i + 1 < pathParts.length) {
                    return pathParts[i + 1];
                }
            }
            throw new SentryError('Could not extract issue ID from URL');
        }
        catch (error) {
            if (error instanceof SentryError) {
                throw error;
            }
            throw new SentryError('Invalid Sentry URL');
        }
    }
    // If it's not a URL, validate that it looks like a Sentry issue ID
    const issueIdPattern = /^[a-zA-Z0-9]+$/;
    if (!issueIdPattern.test(issueIdOrUrl)) {
        throw new SentryError('Invalid Sentry issue ID format');
    }
    return issueIdOrUrl;
}
/**
 * Creates a formatted stacktrace from a Sentry event
 *
 * @param event - The Sentry event data
 * @returns A formatted stacktrace string
 */
export function createStacktrace(event) {
    if (!event || !event.entries) {
        return 'No stacktrace available';
    }
    // Find the exception entry
    const exceptionEntry = event.entries.find((entry) => entry.type === 'exception');
    if (!exceptionEntry || !exceptionEntry.data || !exceptionEntry.data.values) {
        return 'No stacktrace available';
    }
    // Get the most recent exception
    const exception = exceptionEntry.data.values[0];
    if (!exception) {
        return 'No stacktrace available';
    }
    // Format the stacktrace
    let stacktrace = `Exception: ${exception.type}: ${exception.value}\n\nStacktrace:\n`;
    if (exception.stacktrace && exception.stacktrace.frames) {
        // Reverse the frames to show most recent call last (like Python)
        const frames = [...exception.stacktrace.frames].reverse();
        frames.forEach((frame, index) => {
            const filename = frame.filename || '<unknown>';
            const lineno = frame.lineno || '?';
            const function_name = frame.function || '<anonymous>';
            stacktrace += `  ${index + 1}. ${filename}:${lineno} in ${function_name}\n`;
            // Add context code if available
            if (frame.context_line) {
                stacktrace += `     ${frame.context_line.trim()}\n`;
            }
        });
    }
    else {
        stacktrace += '  No frames available\n';
    }
    return stacktrace;
}
