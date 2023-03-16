import * as SentrySvelte from '@sentry/svelte';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';

SentrySvelte.init({
    dsn: PUBLIC_SENTRY_DSN
})

export const handleError: HandleClientError = ({ error, event }) => {
    const errorId = crypto.randomUUID();
    SentrySvelte.captureException(error, {
        contexts: { sveltekit: { event, errorId } },
    });

    return {
        message: 'Der skete en uventet fejl.',
        errorId
    }
}