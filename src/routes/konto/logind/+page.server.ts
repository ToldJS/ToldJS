import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

const PROVIDERS = ['google', 'discord', 'github'];

export const actions: Actions = {
    login: async ({ request, locals, url }) => {
        const provider = url.searchParams.get('provider') as Provider;
        if (provider) {
            if (!PROVIDERS.includes(provider)) {
                return fail(400, {error: 'Ugyldig OAuth udbyder.'});
            }
            const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
                provider: provider
            });
            if (err) {
                console.log(err);
                return fail(400, { error: 'Der skete en uventet fejl.' });
            }

            throw redirect(303, data.url);
        }

        const body = Object.fromEntries(await request.formData());

        const { data, error: err } = await locals.supabase.auth.signInWithPassword({
            email: body.email as string,
            password: body.password as string,
        });

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return fail(400, { error: 'Ugyldig email eller adgangskode.' })
            }
            throw fail(500, { error: 'Server error. Please try again later.' })
        }

        throw redirect(303, '/konto')
    }
};