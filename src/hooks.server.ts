import * as SentryNode from '@sentry/node';
import crypto from 'crypto';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

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


async function setupLocals({ event, resolve }) {
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event
    });
    event.locals.getSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    return resolve(event);
}

async function checkTheme({ event, resolve }) {
    let theme: string | null = null;

    const newTheme = event.url.searchParams.get('theme');
    const cookieTheme = event.cookies.get('colortheme');

    if (newTheme) {
        theme = newTheme;
    } else if (cookieTheme) {
        theme = cookieTheme;
    }
    if (theme) {
        return await resolve(event, {
            transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
        })
    }

    return resolve(event);
}

export const handle: Handle = sequence(setupLocals, checkTheme);