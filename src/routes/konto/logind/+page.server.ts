import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { error, redirect, type Actions } from '@sveltejs/kit';

const PROVIDERS = ['google', 'discord', 'github'];

export const actions: Actions = {
    login: async ({ request, locals, url }) => {
        const provider = url.searchParams.get('provider') as Provider;
        if (provider) {
            if (!PROVIDERS.includes(provider)) {
                throw error(400, 'Provider not supported');
            }
            const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
                provider: provider
            });
            if (err) {
                console.log(err);
                throw error(400, 'Login failed');
            }

            throw redirect(303, data.url);
        }

        const body = Object.fromEntries(await request.formData());

        const { data, error: err } = await locals.supabase.auth.signInWithPassword({
            email: body.email as string,
            password: body.password as string,
        });

        if (err) {
            console.log(err);
            if (err instanceof AuthApiError && err.status === 400) {
                throw error(400, 'Ugyldig email eller adgangskode.')
            }
            throw error(500, 'Server error. Please try again later')
        }

        throw redirect(303, '/konto')
    }
};