import * as SentryNode from '@sentry/node';
import crypto from 'crypto';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SENTRY_DSN } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private'
import type { Handle, HandleServerError } from '@sveltejs/kit';
import type { Database } from '$lib/database';

SentryNode.init({
    dsn: PUBLIC_SENTRY_DSN
})

export const handleError: HandleServerError = ({ error, event }) => {
    const errorId = crypto.randomUUID();
    SentryNode.captureException(error, {
        contexts: { sveltekit: { event, errorId } },
    });

    return {
        message: 'Der skete en uventet fejl.',
        errorId
    }
}

export const handle: Handle = (async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PRIVATE_SUPABASE_SERVICE_KEY,
        event
    });
    event.locals.getSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    return resolve(event);
});
